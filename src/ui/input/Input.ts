import Component, { Props } from "../../shared/Component";

import styles from "./Input.module.css";

export default class Input extends Component<HTMLInputElement> {
  constructor(props: Props<HTMLInputElement>) {
    super({
      ...props,
      tag: "input",
      className: `${styles.input} ${props.className || ""}`,
    });
  }

  getValue() {
    return this.element.value;
  }

  setValidityStyles(isValid: boolean) {
    if (isValid) {
      this.removeClass(styles.invalid);
      this.addClass(styles.valid);
    } else {
      this.removeClass(styles.valid);
      this.addClass(styles.invalid);
    }
  }
}
