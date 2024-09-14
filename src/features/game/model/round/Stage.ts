import type { Word } from "../../../../entities/word";

export const StageStatus = {
  NOT_COMPLETED: "notCompleted",
  CORRECT: "correct",
  INCORRECT: "incorrect",
  AUTOCOMPLETED: "autocompleted",
} as const;

export type StageStatus = (typeof StageStatus)[keyof typeof StageStatus];
export interface Stage {
  status: StageStatus;
  stageNumber: number;
  sentence: string;
  sentenceLength: number;
  translation: string;
  audio: string;
}

export function calculateCardWidthPercentage(sentence: string, word: string) {
  const totalCharacters = sentence.split(" ").join("").length;

  return (100 * word.length) / totalCharacters;
}

export function generateStageWords(
  stage: Stage,
  imageSrc: string,
): Array<Word> {
  const { sentence, stageNumber } = stage;

  let offset = 0;
  return sentence
    .split(" ")
    .map((text, index, arr) => {
      const width = calculateCardWidthPercentage(sentence, text);
      const word = {
        text,
        width,
        correctPosition: index,
        isLast: index === arr.length - 1,
        offset,
        stage: stageNumber,
        image: imageSrc,
      };
      offset += width;
      return word;
    })
    .sort(() => Math.random() - 0.5);
}
