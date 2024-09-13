import { Component } from "../../../shared/ui";
import PickRow from "../../../features/game/fields/PickRow";

import RoundState from "../../../features/game/model/RoundState";
import { HintSettings } from "../../../features/hints";

import { Observer, Publisher } from "../../../entities/state";

import {
  calculateImageAspectRatio,
  debounceListener,
} from "../../../shared/helpers";

import styles from "./WordsPicker.module.css";

export default class WordsPicker extends Component implements Observer {
  private row: PickRow | null = null;

  private roundId: string = "";

  private imageAspectRatio: number = 0;

  private boundResizeHandler: EventListener;

  constructor(
    private roundState: RoundState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.words,
    });

    roundState.subscribe(this);

    this.boundResizeHandler = debounceListener(
      this.handleResize.bind(this),
      200,
    );

    window.addEventListener("resize", this.boundResizeHandler);
  }

  async update(publisher: Publisher) {
    if (!(publisher instanceof RoundState)) return;

    const { id, currentStage } = publisher.state;

    // new round
    if (id !== this.roundId) {
      await this.updateHeight();
      this.row = this.createRow();
    }

    // new stage
    if (!this.row || this.row.stageNumber !== currentStage) {
      this.row = this.createRow();
    }

    this.roundId = id;
    this.toggleAttribute("hidden", publisher.isRoundCompleted());
  }

  private handleResize() {
    this.updateHeight().catch((err: unknown) => {
      console.error(err);
    });
  }

  private async updateHeight() {
    // make visible to get row width
    this.removeAttribute("hidden");

    this.imageAspectRatio = await calculateImageAspectRatio(
      this.roundState.state.painting.imageSrc,
    );

    const { width } = this.getElement().getBoundingClientRect();
    this.getElement().style.height = `${width / this.imageAspectRatio / 10}px`;
  }

  private createRow(): PickRow {
    if (this.row) this.row.deleteRow();

    const row = new PickRow(
      this.roundState.state.currentStage,
      this.roundState,
      this.hintSettings,
    );

    this.append(row);
    row.updateCells(this.roundState.state.content.pickArea);

    return row;
  }

  destroy() {
    this.clear();

    window.removeEventListener("resize", this.boundResizeHandler);
    this.element.remove();
  }
}
