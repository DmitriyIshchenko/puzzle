import State from "../../../app/state/StatePublisher";
import { GameData, StageStatus, Word, WordAction } from "../types";

import rawData from "../../../../data/words.json";
import { getShuffledSentence, splitSentence } from "../../../shared/helpers";

const STAGES_PER_ROUND = 10;

function prepareState(round: number, stage: number): GameData {
  const roundContent = rawData.rounds[round].words.map((entry) => ({
    sentence: entry.textExample,
    translation: entry.textExampleTranslate,
    audioPath: entry.audioExample,
  }));
  const { sentence, translation, audioPath } = roundContent[stage];
  const allSentences = roundContent.map((entry) => entry.sentence);
  const sentenceLength = sentence.length;

  const shuffledSentence = getShuffledSentence(sentence);

  return {
    levels: {
      round,
      stage,
      status: StageStatus.NOT_COMPLETED,
    },
    content: {
      roundSentences: allSentences,
      sentence,
      sentenceLength,
      assembleArea: new Array<Word | null>(shuffledSentence.length).fill(null),
      pickArea: shuffledSentence,
    },
    hints: {
      content: { translation, audioPath },
      settings: { translation: false, audio: true },
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
        break;
      }
      case "drop/cancel":
        break;
      case "click/move": {
        // insert in the first empty cell
        const insertPosition = areaTo.indexOf(null);
        areaTo[insertPosition] = areaFrom[indexFrom];
        areaFrom[indexFrom] = null;
        break;
      }
      default:
        break;
    }

    this.state.levels.status = StageStatus.NOT_COMPLETED;

    this.notifySubscribers();
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

  isStageCompleted() {
    return [StageStatus.AUTOCOMPLETED, StageStatus.CORRECT].includes(
      this.state.levels.status,
    );
  }

  toggleTranslationHint() {
    this.state.hints.settings.translation =
      !this.state.hints.settings.translation;

    this.notifySubscribers();
  }
}
