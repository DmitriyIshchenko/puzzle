import type { Word } from "../features/game/types";

const ROW_WIDTH = 728;
const CONCAVE_WIDTH = 10;

// take concave width into account in order to visually align narrow pieces like "a", "I", "at" etc
export function calculateCardWidthPixels(sentence: string, word: string) {
  const totalWords = sentence.split(" ").length;
  const totalCharacters = sentence.split(" ").join("").length;

  const availableSpace = ROW_WIDTH - CONCAVE_WIDTH * totalWords;

  return (availableSpace * word.length) / totalCharacters + CONCAVE_WIDTH;
}

export function splitSentence(sentence: string): Array<Word> {
  return sentence.split(" ").map((word, index, arr) => ({
    text: word,
    width: calculateCardWidthPixels(sentence, word),
    correctPosition: index,
    isLast: index === arr.length - 1,
  }));
}

export function getShuffledSentence(sentence: string): Array<Word> {
  return splitSentence(sentence).sort(() => Math.random() - 0.5);
}

export function assertNonNull<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error(`Not defined!`);
  }
  return value;
}
