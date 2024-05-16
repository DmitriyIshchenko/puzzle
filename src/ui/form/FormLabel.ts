import Component from "../../util/Component";
import styles from "./FormLabel.module.css";

export default class FormLabel extends Component<HTMLLabelElement> {
  constructor(text: string) {
    super({
      tag: "label",
      className: styles.label,
      text,
    });
  }
}
