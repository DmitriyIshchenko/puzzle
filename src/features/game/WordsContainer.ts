import Component from "../../shared/Component";
import { div } from "../../ui/tags";

import styles from "./WordsContainer.module.css";

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

        return card;
      }),
    );
  }

  private calculateCardWidth(word: string) {
    const totalCharacters = this.sentence.split(" ").join("").length;
    return (word.length * 100) / totalCharacters;
  }
}
