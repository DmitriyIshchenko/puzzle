import LEVELS from "../../../../data/levels";
import { Painting } from "../../../entities/painting";
import type { Word } from "../../../entities/word";
import { RoundResult } from "./LevelsState";
import { Stage, StageStatus } from "./Stage";

interface GameContent {
  pickArea: Array<Word | null>;
  assembleArea: Array<Word | null>;
}

export interface Round {
  id: string;
  currentStage: number;
  painting: Painting;
  stages: Array<Stage>;
  content: GameContent;
  results: RoundResult;
}

export function prepareRound(difficulty: number, round: number): Round {
  const rawData = LEVELS[difficulty].rounds[round].words;
  const { author, name, imageSrc, id, year } =
    LEVELS[difficulty].rounds[round].levelData;

  const stages = rawData.map((entry, index) => ({
    stageNumber: index,
    status: StageStatus.NOT_COMPLETED,
    sentence: entry.textExample,
    sentenceLength: entry.textExample.split(" ").length,
    translation: entry.textExampleTranslate,
    audio: entry.audioExample,
  }));

  return {
    id,
    currentStage: 0,
    painting: { author, name, year, imageSrc },
    stages,
    content: {
      pickArea: [],
      assembleArea: [],
    },
    results: {
      roundNumber: round,
      rating: 0,
    },
  };
}
