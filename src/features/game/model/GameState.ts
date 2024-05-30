import State from "../../../app/state/StatePublisher";
import { Word } from "../card/WordCard";

import { getShuffledSentence, splitSentence } from "../../../shared/helpers";
import rawData from "../../../../data/words.json";

const STAGES_PER_ROUND = 10;

export enum StageStatus {
  NOT_COMPLETED,
  CORRECT,
  INCORRECT,
  AUTOCOMPLETED,
}

interface GameData {
  levels: {
    round: number;
    stage: number;
    status: StageStatus;
  };
  content: {
    roundSentences: Array<string>;
    sentence: string;
    sentenceLength: number;
    pickArea: Array<Word | null>;
    assembleArea: Array<Word | null>;
  };
}

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

  pickWord(word: Word | null) {
    const { pickArea, assembleArea } = this.state.content;

    const target = word;
    if (!target) return;

    // put in first empty cell
    const positionToPut = assembleArea.indexOf(null);
    assembleArea[positionToPut] = word;

    // replace with null, then update position property
    pickArea[target.currentPosition] = null;
    target.currentPosition = positionToPut;

    this.notifySubscribers();
  }

  discardWord(word: Word | null) {
    const { pickArea, assembleArea } = this.state.content;
    const target = word;

    if (!target) return;

    // put in first empty cell
    const positionToPut = pickArea.indexOf(null);
    pickArea[positionToPut] = word;

    // replace with null, then update position property
    assembleArea[target.currentPosition] = null;
    target.currentPosition = positionToPut;

    this.state.levels.status = StageStatus.NOT_COMPLETED;

    this.notifySubscribers();
  }

  verifyAnswer() {
    const isCorrect = this.state.content.assembleArea.every((word) =>
      word ? word.correctPosition === word.currentPosition : false,
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

  dropWord(from: number, to: number | null) {
    if (to === null) {
      this.notifySubscribers();
      return;
    }

    const newWord = this.state.content.pickArea[from];
    const oldWord = this.state.content.assembleArea[to];

    if (newWord) {
      newWord.currentPosition = to;
    }
    if (oldWord) {
      oldWord.currentPosition = from;
    }

    this.state.content.assembleArea[to] = newWord;
    this.state.content.pickArea[from] = oldWord;

    this.notifySubscribers();
  }
}
