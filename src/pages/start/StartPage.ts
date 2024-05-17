import Component from "../../shared/Component";

import { span } from "../../ui/tags";

import styles from "./StartPage.module.css";

export default class StartPage extends Component {
  constructor() {
    super({
      tag: "main",
      className: styles.start,
    });

    this.configure();
  }

  configure() {
    const message = span({ text: "Welcome!" });
    this.append(message);
  }
}
