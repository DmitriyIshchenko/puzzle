export function calculateCardWidth(sentence: string, word: string) {
  const totalCharacters = sentence.split(" ").join("").length;
  return (word.length * 100) / totalCharacters;
}

export function splitSentence(sentence: string) {
  return sentence.split(" ").sort(() => Math.random() - 0.5);
}
