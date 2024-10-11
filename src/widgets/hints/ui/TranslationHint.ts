import { Component } from "../../../shared";
import { HintSettings } from "../../../features/hints";
import { RoundState } from "../../../features/levels";
import { Observer, Publisher } from "../../../entities/state";

import styles from "./TranslationHint.module.css";

export class TranslationHint extends Component implements Observer {
  private isShown: boolean | null = null;

  private text: string = "";

  constructor(roundState: RoundState, hintSettings: HintSettings) {
    super({
      tag: "p",
      className: styles.translation,
    });

    roundState.subscribe(this);
    hintSettings.subscribe(this);
  }

  update(publisher: Publisher): void {
    let isStageCompleted;

    if (publisher instanceof RoundState) {
      isStageCompleted = publisher.isStageCompleted();
      const { translation } =
        publisher.state.stages[publisher.state.currentStage];

      if (this.text !== translation) this.setTextContent(translation);
      this.text = translation;
    }

    // this state must be saved inside this class; otherwise, there will be no blur after the stage is completed
    if (publisher instanceof HintSettings) {
      this.isShown = publisher.state.translation;
    }

    if (!this.isShown) this.addClass(styles.blurred);

    // the blur should always be removed when the stage is complete.
    if (isStageCompleted || this.isShown) this.removeClass(styles.blurred);
  }
}
