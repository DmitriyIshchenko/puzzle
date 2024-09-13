import { Component, Button, Modal } from "../../../shared/ui";

import type RoundState from "../model/RoundState";

import { Observer } from "../../../entities/state";

import styles from "./StageControls.module.css";

export default class StageControls extends Component implements Observer {
  autocompleteButton: Button;

  statsButton: Button;

  checkButton: Button;

  continueButton: Button;

  constructor(roundState: RoundState, modal: Modal) {
    super({
      tag: "div",
      className: styles.controls,
    });

    roundState.subscribe(this);

    this.autocompleteButton = new Button(
      "Autocomplete",
      roundState.autocompleteStage.bind(roundState),
    );

    this.statsButton = new Button("Results", () => {
      modal.show();
    });

    this.checkButton = new Button(
      "Check",
      roundState.verifyAnswer.bind(roundState),
    );

    this.continueButton = new Button(
      "Continue",
      roundState.startNextStage.bind(roundState),
    );

    this.appendChildren([
      this.statsButton,
      this.autocompleteButton,
      this.checkButton,
      this.continueButton,
    ]);
  }

  update(roundState: RoundState) {
    this.updateAutocompleteButton(roundState);
    this.updateCheckButton(roundState);
    this.updateContinueButton(roundState);
    this.updateStatsButton(roundState);
  }

  // hide after the round is completed
  // enable when the stage is pending
  updateAutocompleteButton(roundState: RoundState) {
    this.autocompleteButton.toggleAttribute(
      "disabled",
      roundState.isStageCompleted(),
    );

    this.autocompleteButton.toggleAttribute(
      "hidden",
      roundState.isRoundCompleted(),
    );
  }

  // display when the stage is pending
  // enable when all cards are moved to the asseble area
  updateCheckButton(roundState: RoundState) {
    this.checkButton.toggleAttribute("disabled", !roundState.isAssembled());

    this.checkButton.toggleAttribute("hidden", roundState.isStageCompleted());
  }

  // display when you want to start next stage or nex round
  updateContinueButton(roundState: RoundState) {
    this.continueButton.toggleAttribute(
      "hidden",
      !roundState.isStageCompleted(),
    );
  }

  // display only when round is completed
  updateStatsButton(roundState: RoundState) {
    this.statsButton.toggleAttribute("hidden", !roundState.isRoundCompleted());
  }
}
