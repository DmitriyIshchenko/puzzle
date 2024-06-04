import Component from "../../../shared/Component";
import Button from "../../../ui/button/Button";
import GameState from "../model/GameState";

import { Observer } from "../../../shared/Observer";

import styles from "./GameControls.module.css";

export default class GameControls extends Component implements Observer {
  autocompleteButton: Button;

  gameFlowButton: Button;

  constructor() {
    super({
      tag: "div",
      className: styles.controls,
    });

    this.autocompleteButton = new Button("Autocomplete", () => {});
    this.gameFlowButton = new Button("Check", () => {});

    this.appendChildren([this.autocompleteButton, this.gameFlowButton]);
  }

  update(gameState: GameState) {
    this.autocompleteButton.updateCallback(() => {
      gameState.autocompleteRow();
    });

    this.updateFlowButton(gameState);

    if (gameState.isFilled()) {
      this.gameFlowButton.removeAttribute("disabled");
    } else this.gameFlowButton.setAttribute("disabled", "");

    this.append(this.gameFlowButton);
  }

  updateFlowButton(gameState: GameState) {
    const text = gameState.isStageCompleted() ? "Continue" : "Check";
    const callback = gameState.isStageCompleted()
      ? gameState.startNextStage.bind(gameState)
      : gameState.verifyAnswer.bind(gameState);

    this.gameFlowButton.setTextContent(text);
    this.gameFlowButton.updateCallback(callback);
  }
}
