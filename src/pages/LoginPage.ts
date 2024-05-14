import BaseComponent from "../util/BaseComponent";
import LoginForm from "../features/auth/LoginForm";
import Heading, { HeadingTag } from "../ui/heading/Heading";

import styles from "./LoginPage.module.css";

export default class LoginPage extends BaseComponent<HTMLElement> {
  constructor() {
    super({
      tag: "main",
      className: styles.login,
    });

    this.configure();
  }

  configure() {
    const pageTitle = new Heading(HeadingTag.H2, "Log in into your account");
    const form = new LoginForm();

    this.appendChildren([pageTitle, form]);
  }
}
