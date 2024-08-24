import Component from "../../../shared/Component";
import Row from "./Row";
import WordCard from "../card/WordCard";

import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import {
  ANIMATION_DELAY_COEFFICIENT,
  calculateImageAspectRatio,
  findAllInstancesOf,
} from "../../../shared/helpers";

import styles from "./GameField.module.css";

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
    this.fadeAwayAllCards(this.roundState.isRoundCompleted());

    // TODO: subscribe rows to state updates
    // TODO: create a current stage getter
    this.currentRow.updateStatusStyles(
      this.roundState.state.stages[this.roundState.state.currentStage].status,
    );
    await this.currentRow.updateBackgroundPositions();
  }

  private fadeAwayAllCards(isRoundCompleted: boolean) {
    if (isRoundCompleted) {
      const cards = findAllInstancesOf(WordCard, this);
      cards.forEach((card, index) => {
        card.fadeAwayCardText(index / ANIMATION_DELAY_COEFFICIENT);
      });
    }
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
