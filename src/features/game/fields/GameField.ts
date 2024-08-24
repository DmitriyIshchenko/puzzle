import Component from "../../../shared/Component";
import Row from "./Row";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import styles from "./GameField.module.css";
import { calculateImageAspectRatio } from "../../../shared/helpers";

export default class GameField extends Component implements Observer {
  private rows: Array<Row> = [];

  private roundId: string = "";

  private currentRow: Row = this.rows[0];

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

  async update(publisher: Publisher) {
    if (publisher instanceof RoundState) {
      const { currentStage, id } = publisher.state;

      // new round
      if (id !== this.roundId) {
        this.createRows(publisher);
      }

      this.roundId = id;
      this.currentRow = this.rows[currentStage];

      this.rows.forEach((row) => {
        row.deactivateRow();
      });
      this.currentRow.activateRow();

      this.currentRow.fillCells(publisher.state.content.assembleArea);
      await this.updateVisuals();
    }
  }

  private async updateVisuals() {
    await this.updateFieldSize();
    this.toogleFinishedRound(this.roundState.isRoundCompleted());

    // TODO: subscribe rows to state updates
    // TODO: create a current stage getter
    this.currentRow.updateStatusStyles(
      this.roundState.state.stages[this.roundState.state.currentStage].status,
    );
    await this.currentRow.updateBackgroundPositions();
  }

  private toogleFinishedRound(isRoundCompleted: boolean) {
    if (isRoundCompleted) {
      this.addClass(styles.completed);
    } else this.removeClass(styles.completed);
  }

  private async updateFieldSize() {
    const aspectRatio = await calculateImageAspectRatio(
      this.roundState.state.painting.imageSrc,
    );
    this.getElement().style.aspectRatio = `${aspectRatio}`;
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
