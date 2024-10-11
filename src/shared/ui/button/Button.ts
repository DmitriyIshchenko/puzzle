import { Component } from "../base/Component";

import styles from "./Button.module.css";

export class Button extends Component<HTMLButtonElement> {
  constructor(
    text: string,
    private onClick: EventListener | null,
    className?: string,
    ...children: Array<Component>
  ) {
    super(
      {
        tag: "button",
        className: `${styles.button} ${className || ""}`,
        text,
        onclick: onClick,
      },
      ...children,
    );
  }

  updateCallback(newCallback: EventListener) {
    if (this.onClick) {
      this.removeListener("click", this.onClick);
    }
    this.onClick = newCallback;
    this.addListener("click", this.onClick);
  }
}
