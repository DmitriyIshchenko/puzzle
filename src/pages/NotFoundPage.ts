import Router from "../app/router/router";
import AuthState from "../features/auth/AuthState";
import Component from "../shared/Component";
import Header from "../ui/header/Header";
import { main, span } from "../ui/tags";

import styles from "./StartPage.module.css";

export default class NotFoundPage extends Component {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super({
      tag: "main",
      className: styles.start,
    });

    this.configure();
  }

  configure() {
    const message = span({ text: "Page not found!" });
    const pageContent = main({ className: styles.content }, message);

    this.appendChildren([new Header(this.authState, this.router), pageContent]);
  }
}
