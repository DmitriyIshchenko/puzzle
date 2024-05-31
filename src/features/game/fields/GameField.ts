import Component from "../../../shared/Component";
import Row from "./Row";
import GameState from "../model/GameState";

import { RowType, StageStatus } from "../types";
import { Observer } from "../../../shared/Observer";

import { splitSentence } from "../../../shared/helpers";

import styles from "./GameField.module.css";

export default class GameField extends Component implements Observer {
  private rows: Array<Row> = [];

  private currentRow: Row | null = null;

  constructor() {
    super({
      tag: "div",
      className: styles.field,
    });
  }

  update(gameState: GameState) {
    if (!this.rows.length) {
      this.createRows(gameState);
    }

    this.currentRow = this.rows[gameState.state.levels.stage];
    this.selectRow(gameState.state.levels.stage);
    this.updateStatusStyles(gameState.state.levels.status);
    this.currentRow.updateCells(gameState.state.content.assembleArea);
  }

  createRows(gameState: GameState) {
    this.rows = gameState.state.content.roundSentences.map(
      (sentence) =>
        new Row(
          RowType.ASSEMBLE,
          new Array<null>(splitSentence(sentence).length).fill(null),
          gameState.actionHandler.bind(gameState),
        ),
    );

    this.appendChildren(this.rows);
  }

  private selectRow(rowIndex: number) {
    this.rows.forEach((row) => {
      row.removeClass(styles.active);
    });

    this.rows[rowIndex].addClass(styles.active);
  }

  updateStatusStyles(status: StageStatus) {
    if (!this.currentRow) return;

    // reset styles
    this.currentRow.removeClass(styles.correct);
    this.currentRow.removeClass(styles.incorrect);

    if ([StageStatus.CORRECT, StageStatus.AUTOCOMPLETED].includes(status))
      this.currentRow.addClass(styles.correct);

    if (status === StageStatus.INCORRECT)
      this.currentRow.addClass(styles.incorrect);
  }
}
