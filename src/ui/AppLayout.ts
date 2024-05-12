import BaseComponent from "../util/BaseComponent";

import styles from "./AppLayout.module.css";

export default class AppLayout extends BaseComponent<HTMLDivElement> {
  constructor() {
    super({
      tag: "div",
      className: styles.app,
    });
  }

  setContent(content: BaseComponent<HTMLElement>) {
    this.clear();

    this.append(content);
  }
}
