import { Component, findAllInstancesOf } from "../../../../shared";

import { RoundState } from "../../../../features/levels";
import { HintSettings } from "../../../../features/hints";
import { WordCard } from "../card/WordCard";
import { AssembleRow } from "../rows/AssembleRow";

import { Observer, Publisher } from "../../../../entities/state";
import { ANIMATION_DELAY_COEFFICIENT } from "../../config/constants";
import { calculateImageAspectRatio } from "../../lib/calculateImageAspectRatio";

import styles from "./SentenceBoard.module.css";

export class SentenceBoard extends Component implements Observer {
  private rows: Array<AssembleRow> = [];

  private roundId: string = "";

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
      const { id } = publisher.state;

      // new round
      if (id !== this.roundId) {
        await this.updateFieldSize();
        this.createRows(publisher);
      }

      this.roundId = id;

      this.fadeAwayAllCards(publisher.isRoundCompleted());
    }
  }

  // I tried to fade the cards from the row class, but when a player auto-completes the last round, the animation starts before the DOM updates the last row (I think). So, the very last card doesn't fade and is already hidden. Maybe there's a better solution than using a timeout

  private fadeAwayAllCards(isRoundCompleted: boolean) {
    if (isRoundCompleted) {
      setTimeout(() => {
        const cards = findAllInstancesOf(WordCard, this);

        cards.forEach((card, index) => {
          card.fadeAwayCardText(index / ANIMATION_DELAY_COEFFICIENT);
        });
      }, 100);
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
      (_, stageNumber) =>
        new AssembleRow(stageNumber, this.roundState, this.hintSettings),
    );

    this.appendChildren(this.rows);
  }

  // redefine to prevent subscribers pollution with dead objects
  clear(): void {
    this.rows.forEach((row) => {
      row.deleteRow();
    });
  }
}
