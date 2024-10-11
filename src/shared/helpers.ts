import { Component } from "./ui/base/Component";

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
