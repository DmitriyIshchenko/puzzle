import Component from "../../../shared/Component";
import { Observer } from "../../../shared/Observer";
import GameState from "../model/GameState";

import styles from "./TranslationHint.module.css";

export default class TranslationHint extends Component implements Observer {
  constructor() {
    super({
      tag: "div",
      className: styles.translation,
    });
  }

  update(gameState: GameState): void {
    const isShown = gameState.state.hints.settings.translation;

    if (isShown || gameState.isStageCompleted()) {
      this.removeClass(styles.blurred);
    } else this.addClass(styles.blurred);

    this.setTextContent(gameState.state.hints.content.translation);
  }
}
