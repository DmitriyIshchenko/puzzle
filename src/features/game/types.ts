export enum RowType {
  PICK = "pickArea",
  ASSEMBLE = "assembleArea",
}

export enum StageStatus {
  NOT_COMPLETED = "notCompleted",
  CORRECT = "correct",
  INCORRECT = "incorrect",
  AUTOCOMPLETED = "autocompleted",
}

export interface Word {
  readonly correctPosition: number;
  text: string;
  width: number;
  isLast: boolean;
  offset: number;
  stage: number;
  image: string;
}

export interface Stage {
  status: StageStatus;
  stageNumber: number;
  sentence: string;
  sentenceLength: number;
  translation: string;
  audio: string;
}

export interface GameContent {
  pickArea: Array<Word | null>;
  assembleArea: Array<Word | null>;
}
