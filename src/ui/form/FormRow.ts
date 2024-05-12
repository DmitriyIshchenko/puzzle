import BaseComponent from "../../util/BaseComponent";

import styles from "./FormRow.module.css";

export default class FormRow extends BaseComponent<HTMLDivElement> {
  constructor(...children: Array<BaseComponent<HTMLElement>>) {
    super({
      tag: "div",
      className: styles.row,
    });

    this.appendChildren(children);
  }
}
