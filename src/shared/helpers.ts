import { Stage, Word } from "../features/game/types";

const IMAGES_BASE_URL =
  "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images";
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
