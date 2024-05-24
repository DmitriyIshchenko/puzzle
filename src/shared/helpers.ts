import { Word } from "../features/game/card/WordCard";

export function calculateCardWidth(sentence: string, word: string) {
  const totalCharacters = sentence.split(" ").join("").length;
  return (word.length * 100) / totalCharacters;
}

export function splitSentence(sentence: string): Array<Word> {
  return sentence.split(" ").map((word, index) => ({
    text: word,
    width: calculateCardWidth(sentence, word),
    correctPosition: index,
    currentPosition: index,
  }));
}

export function getShuffledSentence(sentence: string): Array<Word> {
  return splitSentence(sentence)
    .sort(() => Math.random() - 0.5)
    .map((wordObj, index) => ({ ...wordObj, currentPosition: index }));
}
