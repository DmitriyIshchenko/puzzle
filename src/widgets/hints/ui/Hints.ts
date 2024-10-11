import { HintSettings } from "../../../features/hints";
import { RoundState } from "../../../features/levels";
import { Component } from "../../../shared/ui";
import { PronunciationHint } from "./PronunciationHint";
import { TranslationHint } from "./TranslationHint";

import styles from "./Hints.module.css";

export class Hints extends Component {
  constructor(roundState: RoundState, hintSettings: HintSettings) {
    super({
      tag: "div",
      className: styles.hints,
    });

    const translationHint = new TranslationHint(roundState, hintSettings);
    const pronunciationHint = new PronunciationHint(roundState, hintSettings);

    this.appendChildren([pronunciationHint, translationHint]);
  }
}
