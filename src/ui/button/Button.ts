import Component from "../../shared/Component";

import styles from "./Button.module.css";

export default class Button extends Component<HTMLButtonElement> {
  constructor(
    text: string,
    private onClick: EventListener,
    className: string = "",
    ...children: Array<Component>
  ) {
    super(
      {
        tag: "button",
        className: `${styles.button} ${className}`,
        text,
        onclick: onClick,
      },
      ...children,
    );
  }

  updateCallback(newCallback: EventListener) {
    this.removeListener("click", this.onClick);
    this.onClick = newCallback;
    this.addListener("click", this.onClick);
  }
}
