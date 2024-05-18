import Component from "../../shared/Component";
import { div } from "../../ui/tags";

import { WordData } from "./WordsContainer";

import styles from "./GameField.module.css";

export default class GameField extends Component {
  private row: Component;

  constructor() {
    super({
      tag: "div",
      className: styles.field,
    });

    this.row = div({ className: styles.row });
    this.append(this.row);

    // TODO: use observer pattern
    window.addEventListener(
      "move-word",
      this.handler.bind(this) as (e: Event) => void,
    );
  }

  handler(e: CustomEvent<WordData>) {
    const card = div({ className: styles.word, text: e.detail.word });
    card.getElement().style.width = `${e.detail.width.toString()}%`;

    this.row.append(card);
  }
}
