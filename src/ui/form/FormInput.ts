import Component from "../../util/Component";

import styles from "./FormInput.module.css";

export default class FormInput extends Component<HTMLInputElement> {
  constructor(public name: string) {
    super({
      tag: "input",
      className: styles.input,
    });

    this.configure();
  }

  configure() {
    this.setAttribute("name", this.name);
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
