import Component from "../../../shared/Component";
import Modal from "../../../ui/modal/Modal";
import RoundState from "../model/RoundState";
import { Observer, Publisher } from "../../../shared/Observer";

import styles from "./RoundStats.module.css";
import Button from "../../../ui/button/Button";

export default class RoundStats extends Component implements Observer {
  constructor(
    private roundState: RoundState,
    private modal: Modal,
  ) {
    super({ tag: "div", className: styles.stats });

    this.roundState.subscribe(this);

    const continueButton = new Button(
      "Continue",
      this.roundState.startNextStage.bind(this.roundState),
      styles.continue,
    );

    this.append(continueButton);
  }

  update(publisher: Publisher): void {
    if (publisher instanceof RoundState && publisher.isRoundCompleted()) {
      this.modal.updateContent(this);
    }
  }
}
