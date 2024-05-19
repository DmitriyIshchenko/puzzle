import Component from "../../shared/Component";
import Button from "../../ui/button/Button";

import GameState from "./GameState";
import { Observer } from "../../shared/Observer";

import styles from "./GameControls.module.css";

export default class GameControls extends Component implements Observer {
  constructor() {
    super({
      tag: "div",
      className: styles.controls,
    });
  }

  update(gameState: GameState) {
    this.clear();

    if (!gameState.isSolved) return;

    const continueButton = new Button("Continue", () => {
      gameState.startNextStage();
    });

    this.append(continueButton);
  }
}
