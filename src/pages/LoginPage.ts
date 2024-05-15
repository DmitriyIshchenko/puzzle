import BaseComponent from "../util/BaseComponent";
import AuthState from "../features/auth/AuthState";
import Router from "../app/router/router";

import LoginForm from "../features/auth/LoginForm";
import Heading, { HeadingTag } from "../ui/heading/Heading";

import styles from "./LoginPage.module.css";

export default class LoginPage extends BaseComponent<HTMLElement> {
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
    const pageTitle = new Heading(HeadingTag.H2, "Log in into your account");
    const form = new LoginForm(this.authState, this.router);

    this.appendChildren([pageTitle, form]);
  }
}
