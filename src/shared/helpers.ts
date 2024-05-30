import { Word } from "../features/game/card/WordCard";

const ROW_WIDTH = 728;

export function calculateCardWidthPixels(sentence: string, word: string) {
  const totalCharacters = sentence.split(" ").join("").length;

  return (ROW_WIDTH * word.length) / totalCharacters;
}

export function splitSentence(sentence: string): Array<Word> {
  return sentence.split(" ").map((word, index) => ({
    text: word,
    width: calculateCardWidthPixels(sentence, word),
    correctPosition: index,
    currentPosition: index,
  }));
}

export function getShuffledSentence(sentence: string): Array<Word> {
  return splitSentence(sentence)
    .sort(() => Math.random() - 0.5)
    .map((wordObj, index) => ({ ...wordObj, currentPosition: index }));
}
