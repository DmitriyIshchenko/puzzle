import { RoundResult } from "./model/RoundSettings";

export interface MoveCardAction {
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

export interface HintSettingsData {
  translation: boolean;
  audio: boolean;
  background: boolean;
}

export enum StageStatus {
  NOT_COMPLETED,
  CORRECT,
  INCORRECT,
  AUTOCOMPLETED,
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

export interface Painting {
  author: string;
  name: string;
  imageSrc: string;
  year: string;
}

export interface Round {
  id: string;
  currentStage: number;
  painting: Painting;
  stages: Array<Stage>;
  content: GameContent;
  results: RoundResult;
}
