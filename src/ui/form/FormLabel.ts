import BaseComponent from "../../util/BaseComponent";
import styles from "./FormLabel.module.css";

export default class FormLabel extends BaseComponent<HTMLLabelElement> {
  constructor(text: string) {
    super({
      tag: "label",
      className: styles.label,
      text,
    });
  }
}
