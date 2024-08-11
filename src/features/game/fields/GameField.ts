import Component from "../../../shared/Component";
import Row from "./Row";

import GameState from "../model/GameState";
import { RowType } from "../types";
import { Observer } from "../../../shared/Observer";

import styles from "./GameField.module.css";
import rowStyles from "./Row.module.css";

export default class GameField extends Component implements Observer {
  private rows: Array<Row> = [];

  private currentRow: Row | null = null;

  constructor(gameState: GameState) {
    super({
      tag: "div",
      className: styles.field,
    });

    gameState.subscribe(this);
  }

  update(gameState: GameState) {
    if (!this.rows.length) {
      this.createRows(gameState);
    }

    this.currentRow = this.rows[gameState.state.levels.stage];
    this.setActiveStyles(gameState.state.levels.stage);
    this.currentRow.updateStatusStyles(gameState.state.levels.status);
    this.currentRow.updateCells(gameState.state.content.assembleArea);
  }

  createRows(gameState: GameState) {
    this.rows = gameState.state.content.roundSentences.map(
      (sentence) =>
        new Row(
          RowType.ASSEMBLE,
          new Array<null>(sentence.split(" ").length).fill(null),
          gameState.actionHandler.bind(gameState),
        ),
    );

    this.appendChildren(this.rows);
  }

  private setActiveStyles(rowIndex: number) {
    this.rows.forEach((row) => {
      row.removeClass(rowStyles.active);
    });

    this.rows[rowIndex].addClass(rowStyles.active);
  }
}
