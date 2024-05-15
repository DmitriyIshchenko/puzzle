import Router from "../../app/router/router";
import AuthState from "../../features/auth/AuthState";
import BaseComponent from "../../util/BaseComponent";
import Button from "../button/Button";
import Span from "../form/Span";

import styles from "./Header.module.css";

export default class Header extends BaseComponent<HTMLElement> {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super(
      {
        tag: "header",
        className: styles.header,
      },
      new Span(styles.logo, "Puzzle"),
      new Button("Logout", () => {
        this.authState.logout();
        this.router.navigate("login");
      }),
    );
  }
}
