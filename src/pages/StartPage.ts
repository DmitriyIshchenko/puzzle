import Router from "../app/router/router";
import AuthState from "../features/auth/AuthState";
import PageContent from "../ui/PageContent";
import Span from "../ui/form/Span";
import Header from "../ui/header/Header";
import BaseComponent from "../util/BaseComponent";

import styles from "./StartPage.module.css";

export default class StartPage extends BaseComponent {
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
    this.appendChildren([
      new Header(this.authState, this.router),
      new PageContent(styles.content, new Span("", "Welcome!")),
    ]);
  }
}
