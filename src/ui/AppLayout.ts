import Component from "../util/Component";

import styles from "./AppLayout.module.css";

export default class AppLayout extends Component<HTMLDivElement> {
  constructor() {
    super({
      tag: "div",
      className: styles.app,
    });
  }

  setContent(content: Component) {
    this.clear();

    this.append(content);
  }
}
