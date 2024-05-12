import BaseComponent from "../../util/BaseComponent";

import styles from "./Button.module.css";

export default class Button extends BaseComponent<HTMLButtonElement> {
  constructor(
    buttonText: string,
    private listener: EventListener,
  ) {
    super({
      tag: "button",
      className: styles.button,
      text: buttonText,
    });
  }

  configure() {
    this.addListener("click", this.listener);
  }
}
