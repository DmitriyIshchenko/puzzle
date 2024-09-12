import Component from "./ui/base/Component";
import LEVELS from "../../data/levels";
import { StageStatus } from "../features/game/model/StageStatus";
import { type Word } from "../features/game/card/WordCard";
import { type Round, type Stage } from "../features/game/model/RoundState";

export const IMAGES_BASE_URL =
  "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images";
export const ANIMATION_DELAY_COEFFICIENT = 50;
export const RATING_THRESHOLDS = {
  perfect: 1,
  good: 0.7,
  passed: 0.5,
};

const ROW_WIDTH = 728;
const CONCAVE_WIDTH = 10;
// take concave width into account in order to visually align narrow pieces like "a", "I", "at" etc
export function calculateCardWidthPixels(sentence: string, word: string) {
  const totalWords = sentence.split(" ").length;
  const totalCharacters = sentence.split(" ").join("").length;

  const availableSpace = ROW_WIDTH - CONCAVE_WIDTH * totalWords;

  return (availableSpace * word.length) / totalCharacters + CONCAVE_WIDTH;
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

export function assertNonNull<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error(`Not defined!`);
  }
  return value;
}

export function isValidSetting<T extends object>(
  key: string | number | symbol,
  state: T,
): key is keyof T {
  return key in state;
}

export async function calculateImageAspectRatio(src: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = `${IMAGES_BASE_URL}/${src}`;
    img.addEventListener("load", () => {
      resolve(img);
    });

    img.addEventListener("error", () => {
      reject(new Error(`Failed to load image: ${src}`));
    });
  });

  return image.naturalWidth / image.naturalHeight;
}

// use never since any is not allowed
export function findAllInstancesOf<T>(
  classConstructor: new (...args: never[]) => T, // return an instance of type T
  component: Component,
): T[] {
  let instances: T[] = [];

  if (component instanceof classConstructor) {
    instances.push(component);
  }

  component.getChildren().forEach((child) => {
    instances = instances.concat(findAllInstancesOf(classConstructor, child));
  });

  return instances;
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

export function debounceListener<T extends EventListener>(
  handler: T,
  wait: number = 200,
) {
  let timeout: ReturnType<typeof setTimeout>;

  return function debounced(
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handler.apply(this, args);
    }, wait);
  };
}
