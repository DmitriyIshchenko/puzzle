import Component from "../../../shared/Component";
import Row from "./Row";
import { p } from "../../../ui/tags";

import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";

import {
  ANIMATION_DELAY_COEFFICIENT,
  calculateImageAspectRatio,
} from "../../../shared/helpers";

import styles from "./WordsPicker.module.css";

export default class WordsPicker extends Component implements Observer {
  private row: Row | null = null;

  private imageAspectRatio: number = 0;

  private paintingInfo: Component;

  constructor(
    private roundState: RoundState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.words,
    });

    roundState.subscribe(this);

    this.paintingInfo = p({
      className: styles.info,
      text: "sdfsgjsgh- sdgjhjsgj",
    });
    this.append(this.paintingInfo);

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
      await this.row.updateBackgroundPositions();
      this.revealPaintingInfo(publisher);
    }
  }

  private revealPaintingInfo(publisher: RoundState) {
    const isRoundCompleted = publisher.isRoundCompleted();
    const { author, name, year } = publisher.state.painting;
    const infoString = `${author} — ${name} (${year})`;

    const totalWords = publisher.state.stages.reduce(
      (acc, cur) => acc + cur.sentenceLength,
      0,
    );

    if (isRoundCompleted) {
      this.paintingInfo.setTextContent(infoString);
      this.paintingInfo.addClass(styles.appeared);
      this.paintingInfo.setInlineStyles({
        transitionDelay: `${(totalWords - 1) / ANIMATION_DELAY_COEFFICIENT}s`,
      });
    } else this.paintingInfo.removeClass(styles.appeared);
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
