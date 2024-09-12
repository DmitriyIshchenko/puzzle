import { Component, span } from "../../shared/ui";

import styles from "./NotRoundPage.module.css";

export default class NotFoundPage extends Component {
  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.configure();
  }

  configure() {
    const message = span({ text: "Page not found!" });
    this.append(message);
  }
}
