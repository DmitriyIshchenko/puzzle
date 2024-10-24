import { AuthState } from "../../features/auth/model/AuthState";
import { Router } from "../../app/router/router";

import { Component, h2 } from "../../shared";
import { LoginForm } from "../../features/auth/ui/LoginForm";

import styles from "./LoginPage.module.css";

export class LoginPage extends Component {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super({
      tag: "main",
      className: styles.login,
    });

    this.configure();
  }

  configure() {
    const pageTitle = h2({
      text: "Log in into your account",
      className: styles.title,
    });
    const form = new LoginForm(this.authState, this.router);

    this.appendChildren([pageTitle, form]);
  }
}
