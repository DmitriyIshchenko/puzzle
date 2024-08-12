export interface Word {
  text: string;
  width: number;
  readonly correctPosition: number;
  isLast: boolean;
  offset: number;
  stage: number;
  backgroundImage: string;
}

export interface WordAction {
  type: string;
  payload: {
    indexFrom: number;
    rowFrom: RowType;
    indexTo: number;
    rowTo: RowType;
  };
}
export enum RowType {
  PICK = "pickArea",
  ASSEMBLE = "assembleArea",
}
export enum StageStatus {
  NOT_COMPLETED,
  CORRECT,
  INCORRECT,
  AUTOCOMPLETED,
}
export interface GameData {
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
  hints: {
    content: {
      translation: string;
      audioPath: string;
      backgroundImage: string;
    };
  };
}

export interface HintSettingsData {
  translation: boolean;
  audio: boolean;
  background: boolean;
}
