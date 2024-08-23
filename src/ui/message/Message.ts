import Component from "../../shared/Component";
import Button from "../button/Button";
import { i, span } from "../tags";

import styles from "./Message.module.css";

export enum MessageType {
  INFO,
  WARNING,
  ERROR,
}

const icons = {
  [MessageType.INFO]: `bi bi-info-circle ${styles.info}`,
  [MessageType.WARNING]: `bi bi-exclamation-circle ${styles.warning}`,
  [MessageType.ERROR]: `bi bi-exclamation-circle ${styles.error}`,
};

export default class MessageCard extends Component {
  constructor(text: string, type: MessageType, button?: Button) {
    super({
      tag: "div",
      className: styles.message,
    });

    const message = span({ text, className: styles.text });
    const icon = i({
      className: type === MessageType.INFO ? icons[type] : icons[type],
    });

    this.appendChildren([icon, message]);

    if (button) {
      this.append(button);
    }
  }
}
