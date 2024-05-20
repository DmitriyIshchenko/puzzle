import Component from "../../../shared/Component";
import Button from "../../../ui/button/Button";

import GameState, { RowStatus } from "../model/GameState";
import { Observer } from "../../../shared/Observer";

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

    if (!gameState.isFilled()) return;

    const buttonText =
      gameState.state.rowStatus === RowStatus.CORRECT ? "Continue" : "Check";

    const buttonCallback =
      gameState.state.rowStatus === RowStatus.CORRECT
        ? gameState.startNextStage.bind(gameState)
        : gameState.verifyAnswer.bind(gameState);

    const button = new Button(buttonText, buttonCallback);

    this.append(button);
  }
}
