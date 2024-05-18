import Component from "../../shared/Component";
import { div } from "../../ui/tags";

import styles from "./WordsContainer.module.css";

export default class WordsContainer extends Component {
  constructor(private sentence: string) {
    super({
      tag: "div",
      className: styles.words,
    });

    this.configure();
  }

  private configure() {
    const words = this.sentence
      .split(" ")
      .map((word) => div({ className: styles.word, text: word }));

    this.appendChildren(words);
  }
}
