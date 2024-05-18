import Component from "../../shared/Component";
import { div } from "../../ui/tags";

import styles from "./WordsContainer.module.css";

export type WordData = {
  word: string;
  width: number;
};

export default class WordsContainer extends Component {
  private words: Array<string> = [];

  constructor(private sentence: string) {
    super({
      tag: "div",
      className: styles.words,
    });

    this.configure();
  }

  private configure() {
    this.words = this.sentence.split(" ").sort(() => Math.random() - 0.5);

    this.updateWords();
  }

  private updateWords() {
    this.clear();

    this.appendChildren(
      this.words.map((word) => {
        const card = div({ className: styles.word, text: word });
        card.getElement().style.width = `${this.calculateCardWidth(word).toString()}%`;

        card.addListener("click", () => {
          this.moveWord(word);
        });

        return card;
      }),
    );
  }

  private moveWord(word: string) {
    const index = this.words.indexOf(word);

    this.words.splice(index, 1);

    // TODO: use observer pattern
    window.dispatchEvent(
      new CustomEvent<WordData>("move-word", {
        detail: {
          word,
          width: this.calculateCardWidth(word),
        },
      }),
    );

    this.updateWords();
  }

  private calculateCardWidth(word: string) {
    const totalCharacters = this.sentence.split(" ").join("").length;
    return (word.length * 100) / totalCharacters;
  }
}
