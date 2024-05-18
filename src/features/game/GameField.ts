import Component from "../../shared/Component";

import styles from "./GameField.module.css";

export default class GameField extends Component {
  constructor() {
    super({
      tag: "div",
      className: styles.field,
    });
  }
}
