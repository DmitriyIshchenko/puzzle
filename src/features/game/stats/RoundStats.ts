import Component from "../../../shared/Component";
import Modal from "../../../ui/modal/Modal";
import RoundState from "../model/RoundState";
import { Observer, Publisher } from "../../../shared/Observer";

import styles from "./RoundStats.module.css";

export default class RoundStats extends Component implements Observer {
  constructor(
    private roundState: RoundState,
    private modal: Modal,
  ) {
    super({ tag: "div", className: styles.stats });

    this.roundState.subscribe(this);
  }

  update(publisher: Publisher): void {
    if (publisher instanceof RoundState && publisher.isRoundCompleted()) {
      this.setTextContent("Round stats");
      this.modal.updateContent(this);
    }
  }
}
