import Component from "../../util/Component";
import Span from "./Span";

import styles from "./FormErrorsLabel.module.css";

export default class FormErrorsLabel extends Component<HTMLLabelElement> {
  constructor() {
    super({
      tag: "label",
      className: styles.errors,
    });
  }

  setErrors(errors: Array<string>) {
    this.appendChildren(
      errors.map((message) => new Span(styles.message, message)),
    );
  }
}
