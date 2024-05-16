import Component from "../../util/Component";

import styles from "./FormRow.module.css";

export default class FormRow extends Component<HTMLDivElement> {
  constructor(...children: Array<Component>) {
    super({
      tag: "div",
      className: styles.row,
    });

    this.appendChildren(children);
  }
}
