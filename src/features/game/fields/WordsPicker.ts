import Component from "../../../shared/Component";
import Row from "./Row";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import styles from "./WordsPicker.module.css";
import { calculateImageAspectRatio } from "../../../shared/helpers";

export default class WordsPicker extends Component implements Observer {
  private row: Row | null = null;

  private imageAspectRatio: number = 0;

  constructor(
    private roundState: RoundState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.words,
    });

    roundState.subscribe(this);

    window.addEventListener("resize", this.handleResize.bind(this));
  }

  async update(publisher: Publisher) {
    if (publisher instanceof RoundState) {
      const { currentStage } = publisher.state;
      const stage = publisher.state.stages[currentStage];

      if (!this.row || stage.sentenceLength !== this.row.getChildren().length) {
        this.row = this.createRow(publisher);
      }

      this.row.fillCells(publisher.state.content.pickArea);
      await this.updateHeight();
    }
  }

  private handleResize() {
    this.updateHeight().catch((err: unknown) => {
      console.error(err);
    });
  }

  private async updateHeight() {
    if (!this.imageAspectRatio) {
      this.imageAspectRatio = await calculateImageAspectRatio(
        this.roundState.state.painting.imageSrc,
      );
    }

    const { width } = this.getElement().getBoundingClientRect();

    this.getElement().style.height = `${width / this.imageAspectRatio / 10}px`;
  }

  private createRow(roundState: RoundState): Row {
    if (this.row) this.row.deleteRow();

    const row = new Row(
      RowType.PICK,
      roundState.state.content.pickArea,
      roundState.moveCard.bind(roundState),
      this.hintSettings,
    );

    this.append(row);

    return row;
  }
}
