import Component from "../../../shared/Component";
import Button from "../../../ui/button/Button";

import GameState, { RowStatus } from "../model/GameState";
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

    // TODO: It would be convenient if the game state was a singleton
    this.autocompleteButton = new Button("Autocomplete", () => {});
    this.gameFlowButton = new Button("Check", () => {});

    this.appendChildren([this.autocompleteButton, this.gameFlowButton]);
  }

  update(gameState: GameState) {
    this.gameFlowButton.destroy();
    this.autocompleteButton.updateCallback(() => {
      gameState.autocompleteRow();
    });

    const buttonText =
      gameState.state.rowStatus === RowStatus.CORRECT ? "Continue" : "Check";

    const buttonCallback =
      gameState.state.rowStatus === RowStatus.CORRECT
        ? gameState.startNextStage.bind(gameState)
        : gameState.verifyAnswer.bind(gameState);

    this.gameFlowButton = new Button(buttonText, buttonCallback);

    if (gameState.isFilled()) {
      this.gameFlowButton.removeAttribute("disabled");
    } else this.gameFlowButton.setAttribute("disabled", "");

    this.append(this.gameFlowButton);
  }
}
