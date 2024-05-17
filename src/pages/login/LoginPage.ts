import AuthState from "../../features/auth/AuthState";
import Router from "../../app/router/router";

import Component from "../../shared/Component";
import LoginForm from "../../features/auth/LoginForm";
import { h2 } from "../../ui/tags";

import styles from "./LoginPage.module.css";

export default class LoginPage extends Component {
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
