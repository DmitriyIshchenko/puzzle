import BaseComponent from "../../components/BaseComponent";
import styles from "./FormLabel.module.css";

export default class FormLabel extends BaseComponent {
  constructor(text: string) {
    super({
      tag: "label",
      className: styles.label,
      text,
    });
  }
}
