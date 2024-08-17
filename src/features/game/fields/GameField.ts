import Component from "../../../shared/Component";
import Row from "./Row";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import styles from "./GameField.module.css";

export default class GameField extends Component implements Observer {
  private rows: Array<Row> = [];

  constructor(
    private roundState: RoundState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.field,
    });

    this.roundState.subscribe(this);
  }

  update(publisher: Publisher) {
    if (publisher instanceof RoundState) {
      const { currentStage } = publisher.state;

      // new round
      if (!this.rows.length || currentStage === 0) {
        this.createRows(publisher);
      }

      const currentRow = this.rows[currentStage];

      this.rows.forEach((row) => {
        row.deactivateRow();
      });
      currentRow.activateRow();

      currentRow.fillCells(publisher.state.content.assembleArea);
      currentRow.updateStatusStyles(
        publisher.state.stages[currentStage].status,
      );
    }
  }

  private createRows(roundState: RoundState) {
    const { stages } = roundState.state;

    this.clear();
    this.rows = stages.map(
      (stage) =>
        new Row(
          RowType.ASSEMBLE,
          new Array<null>(stage.sentenceLength).fill(null),
          roundState.moveCard.bind(roundState),
          this.hintSettings,
        ),
    );

    this.appendChildren(this.rows);
  }

  // redefine to prevent subscribers pollution with dead objects
  clear(): void {
    this.rows.forEach((row) => {
      this.hintSettings.unsubscribe(row);
      row.destroy();
    });
  }
}
