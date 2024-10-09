import { LevelsState, RoundControls } from "../../../features/levels";
import { HintControls, HintSettings } from "../../../features/hints";

import { Component } from "../../../shared/ui";

import styles from "./Controls.module.css";

export class Controls extends Component {
  constructor(levelsState: LevelsState, hintSettings: HintSettings) {
    super({
      tag: "div",
      className: styles.controls,
    });

    const roundControls = new RoundControls(levelsState);
    const hintControls = new HintControls(hintSettings);

    this.appendChildren([roundControls, hintControls]);
  }
}
