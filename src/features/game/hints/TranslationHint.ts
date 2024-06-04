import Component from "../../../shared/Component";
import { Observer } from "../../../shared/Observer";
import GameState from "../model/GameState";

import styles from "./TranslationHint.module.css";

export default class TranslationHint extends Component implements Observer {
  constructor() {
    super({
      tag: "p",
      className: styles.translation,
    });
  }

  update(gameState: GameState): void {
    this.setTextContent(gameState.state.hints.content.translation);
  }
}
