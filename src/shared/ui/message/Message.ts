import Component from "../base/Component";
import Button from "../button/Button";
import { i, span } from "../base/tags";

import styles from "./Message.module.css";

export const MessageType = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

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
