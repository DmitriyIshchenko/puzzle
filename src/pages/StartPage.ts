import AuthState from "../features/auth/AuthState";
import Router from "../app/router/router";

import Component from "../shared/Component";
import Header from "../ui/header/Header";

import { main, span } from "../ui/tags";

import styles from "./StartPage.module.css";

export default class StartPage extends Component {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super({
      tag: "div",
      className: styles.start,
    });

    this.configure();
  }

  configure() {
    const message = span("Welcome!");
    const pageContent = main({ className: styles.content }, message);
    this.appendChildren([new Header(this.authState, this.router), pageContent]);
  }
}
