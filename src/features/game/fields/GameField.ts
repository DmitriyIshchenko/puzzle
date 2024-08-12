import Component from "../../../shared/Component";
import Row from "./Row";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import GameState from "../model/GameState";
import HintSettings from "../model/HintSettings";

import styles from "./GameField.module.css";
import rowStyles from "./Row.module.css";

export default class GameField extends Component implements Observer {
  private rows: Array<Row> = [];

  private currentRow: Row | null = null;

  constructor(
    gameState: GameState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.field,
    });

    gameState.subscribe(this);
  }

  update(publisher: Publisher) {
    if (publisher instanceof GameState) {
      if (!this.rows.length) {
        this.createRows(publisher);
      }

      this.currentRow = this.rows[publisher.state.levels.stage];
      this.setActiveStyles(publisher.state.levels.stage);
      this.currentRow.fillCells(publisher.state.content.assembleArea);
      this.currentRow.updateStatusStyles(publisher.state.levels.status);
    }
  }

  createRows(gameState: GameState) {
    this.rows = gameState.state.content.roundSentences.map(
      (sentence) =>
        new Row(
          RowType.ASSEMBLE,
          new Array<null>(sentence.split(" ").length).fill(null),
          gameState.actionHandler.bind(gameState),
          this.hintSettings,
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
