import Component from "../../shared/Component";

import styles from "./Button.module.css";

export default class Button extends Component<HTMLButtonElement> {
  constructor(
    text: string,
    onClick: EventListener,
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
}
