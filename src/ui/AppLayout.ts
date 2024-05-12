import BaseComponent from "../components/BaseComponent";

import styles from "./AppLayout.module.css";

export default class AppLayout extends BaseComponent {
  constructor() {
    super({
      tag: "div",
      className: styles.app,
    });
  }

  setContent(content: BaseComponent) {
    this.clear();

    this.append(content);
  }
}
