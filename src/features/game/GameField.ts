import Component from "../../shared/Component";
import { div } from "../../ui/tags";

import { Observer } from "../../shared/Observer";

import styles from "./GameField.module.css";
import GameState from "./GameState";
import WordCard from "./WordCard";
import { calculateCardWidth } from "../../shared/helpers";

export default class GameField extends Component implements Observer {
  private rows: Array<Component>;

  constructor() {
    super({
      tag: "div",
      className: styles.field,
    });

    this.rows = Array.from({ length: 10 }, () =>
      div({ className: styles.row }),
    );

    this.appendChildren(this.rows);
  }

  update(gameState: GameState) {
    const row = this.rows[gameState.state.currentRow];

    row.clear();
    row.addClass(styles.active);

    const cards = gameState.state.rowContent.map((word) => {
      const card = new WordCard({
        text: word,
        width: calculateCardWidth(gameState.state.sentence, word),
      });

      // TODO: it is probably a good idea to use event delegation instead
      card.addListener("click", () => {
        gameState.discardWord(word);
      });

      return card;
    });

    row.appendChildren(cards);
  }
}
