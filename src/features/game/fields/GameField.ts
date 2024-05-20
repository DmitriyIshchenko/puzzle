import Component from "../../../shared/Component";
import WordCard from "../card/WordCard";
import { div } from "../../../ui/tags";

import GameState, { RowStatus } from "../model/GameState";
import { Observer } from "../../../shared/Observer";

import { calculateCardWidth } from "../../../shared/helpers";
import styles from "./GameField.module.css";

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
    this.deselectRows();

    const row = this.rows[gameState.state.currentRow];
    row.clear();
    row.addClass(styles.active);

    GameField.setRowStyles(row, gameState);

    const cards = gameState.state.rowContent.map((word) => {
      const card = new WordCard({
        text: word,
        width: calculateCardWidth(gameState.state.sentence, word),
        status: gameState.state.rowStatus,
      });

      // TODO: it is probably a good idea to use event delegation instead
      card.addListener("click", () => {
        gameState.discardWord(word);
      });

      return card;
    });

    row.appendChildren(cards);
  }

  // prevent clicks on non-active rows
  deselectRows() {
    this.rows.forEach((row) => {
      row.removeClass(styles.active);
    });
  }

  // I'm starting to really dislike this eslint rule
  private static setRowStyles(row: Component, gameState: GameState) {
    // reset styles
    row.removeClass(styles.correct);
    row.removeClass(styles.incorrect);

    if (gameState.state.rowStatus === RowStatus.CORRECT)
      row.addClass(styles.correct);

    if (gameState.state.rowStatus === RowStatus.INCORRECT)
      row.addClass(styles.incorrect);
  }
}
