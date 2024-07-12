import Component from "../../../shared/Component";

import GameState from "../model/GameState";
import HintSettings from "../model/HintSettings";
import { Observer } from "../../../shared/Observer";

import styles from "./TranslationHint.module.css";

export default class TranslationHint extends Component implements Observer {
  constructor(gameState: GameState, hintSettings: HintSettings) {
    super({
      tag: "p",
      className: styles.translation,
    });

    gameState.subscribe(this);
    hintSettings.subscribe(this);
  }

  update(gameState: GameState): void {
    const isShown = gameState.state.hints.settings.translation;

    if (isShown || gameState.isStageCompleted()) {
      this.removeClass(styles.blurred);
    } else this.addClass(styles.blurred);

    this.setTextContent(gameState.state.hints.content.translation);
  }
}
