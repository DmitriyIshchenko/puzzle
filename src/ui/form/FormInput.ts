import BaseComponent from "../../util/BaseComponent";

import styles from "./FormInput.module.css";

export default class FormInput extends BaseComponent<HTMLInputElement> {
  constructor(
    private name: string,
    private isRequired: boolean,
  ) {
    super({
      tag: "input",
      className: styles.input,
    });

    this.configure();
  }

  configure() {
    this.setAttribute("name", this.name);
    if (this.isRequired) this.setAttribute("required", "");
  }
}
