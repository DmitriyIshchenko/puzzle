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

  private createAutoCompleteButton(gameState: GameState) {
    const autoCompleteBtn = new Button("Autocomplete", () => {
      gameState.autocompleteRow();
    });
    this.append(autoCompleteBtn);
  }

  private createGameFlowButton(gameState: GameState) {
    const buttonText =
      gameState.state.rowStatus === RowStatus.CORRECT ? "Continue" : "Check";

    const buttonCallback =
      gameState.state.rowStatus === RowStatus.CORRECT
        ? gameState.startNextStage.bind(gameState)
        : gameState.verifyAnswer.bind(gameState);

    const button = new Button(buttonText, buttonCallback);

    this.append(button);
  }

  update(gameState: GameState) {
    this.clear();

    if (gameState.state.rowStatus !== RowStatus.CORRECT) {
      this.createAutoCompleteButton(gameState);
    }

    if (!gameState.isFilled()) return;

    this.createGameFlowButton(gameState);
  }
}
