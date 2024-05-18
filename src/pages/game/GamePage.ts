import Component from "../../shared/Component";

import styles from "./GamePage.module.css";

export default class GamePage extends Component {
  constructor() {
    super({
      tag: "main",
      text: "GAME PAGE",
      className: styles.page,
    });
  }
}
