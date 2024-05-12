import BaseComponent from "../../components/BaseComponent";

import styles from "./FormRow.module.css";

export default class FormRow extends BaseComponent {
  constructor(...children: Array<BaseComponent>) {
    super(
      {
        tag: "div",
        className: styles.row,
      },
      ...children,
    );
  }
}
