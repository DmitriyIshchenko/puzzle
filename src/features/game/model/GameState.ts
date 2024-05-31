import State from "../../../app/state/StatePublisher";
import { GameData, StageStatus, Word, WordAction } from "../types";

import rawData from "../../../../data/words.json";
import { getShuffledSentence, splitSentence } from "../../../shared/helpers";

const STAGES_PER_ROUND = 10;

function prepareState(round: number, stage: number): GameData {
  const roundSentences = rawData.rounds[round].words.map(
    (entry) => entry.textExample,
  );
  const sentence = roundSentences[stage];
  const sentenceLength = sentence.length;

  const shuffledSentence = getShuffledSentence(sentence);

  return {
    levels: {
      round,
      stage,
      status: StageStatus.NOT_COMPLETED,
    },
    content: {
      roundSentences,
      sentence,
      sentenceLength,
      assembleArea: new Array<Word | null>(shuffledSentence.length).fill(null),
      pickArea: shuffledSentence,
    },
  };
}

export default class GameState extends State<GameData> {
  constructor() {
    super(prepareState(0, 0));
  }

  actionHandler(action: WordAction) {
    const { rowTo, rowFrom, indexTo, indexFrom } = action.payload;
    const areaTo = this.state.content[rowTo];
    const areaFrom = this.state.content[rowFrom];

    switch (action.type) {
      case "drop/swap": {
        // swap
        [areaFrom[indexFrom], areaTo[indexTo]] = [
          areaTo[indexTo],
          areaFrom[indexFrom],
        ];

        this.notifySubscribers();
        break;
      }
      case "drop/cancel":
        this.notifySubscribers();
        break;
      case "click/move": {
        // insert in the first empty cell
        const insertPosition = areaTo.indexOf(null);
        areaTo[insertPosition] = areaFrom[indexFrom];
        areaFrom[indexFrom] = null;

        this.notifySubscribers();
        break;
      }
      default:
        break;
    }
  }

  startGame() {
    this.notifySubscribers();
  }

  startNextStage() {
    // TODO: start next round

    // zero-based
    if (this.state.levels.stage === STAGES_PER_ROUND - 1) return;

    this.state = prepareState(0, this.state.levels.stage + 1);

    this.notifySubscribers();
  }

  verifyAnswer() {
    const isCorrect = this.state.content.assembleArea.every((word, index) =>
      word ? word.correctPosition === index : false,
    );

    this.state.levels.status = isCorrect
      ? StageStatus.CORRECT
      : StageStatus.INCORRECT;

    this.notifySubscribers();
  }

  autocompleteRow() {
    const { pickArea, sentence } = this.state.content;

    this.state.content.assembleArea = splitSentence(sentence);
    pickArea.fill(null);

    this.state.levels.status = StageStatus.AUTOCOMPLETED;

    this.notifySubscribers();
  }

  isFilled() {
    return this.state.content.assembleArea.every((item) => item);
  }
}
