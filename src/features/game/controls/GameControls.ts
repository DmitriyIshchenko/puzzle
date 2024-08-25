import Component from "../../../shared/Component";
import Button from "../../../ui/button/Button";

import RoundState from "../model/RoundState";
import { Observer } from "../../../shared/Observer";

import styles from "./GameControls.module.css";

export default class GameControls extends Component implements Observer {
  autocompleteButton: Button;

  gameFlowButton: Button;

  constructor(roundState: RoundState) {
    super({
      tag: "div",
      className: styles.controls,
    });

    roundState.subscribe(this);

    this.autocompleteButton = new Button(
      "Autocomplete",
      roundState.autocompleteStage.bind(roundState),
    );
    this.gameFlowButton = new Button("Check", null);

    this.appendChildren([this.autocompleteButton, this.gameFlowButton]);
  }

  update(roundState: RoundState) {
    if (roundState.isStageCompleted()) {
      this.autocompleteButton.setAttribute("disabled", "");
    } else this.autocompleteButton.removeAttribute("disabled");

    this.updateFlowButton(roundState);

    if (roundState.isAssembled()) {
      this.gameFlowButton.removeAttribute("disabled");
    } else this.gameFlowButton.setAttribute("disabled", "");

    this.append(this.gameFlowButton);
  }

  updateFlowButton(roundState: RoundState) {
    const text = roundState.isStageCompleted() ? "Continue" : "Check";
    const callback = roundState.isStageCompleted()
      ? roundState.startNextStage.bind(roundState)
      : roundState.verifyAnswer.bind(roundState);

    this.gameFlowButton.setTextContent(text);
    this.gameFlowButton.updateCallback(callback);
  }
}
