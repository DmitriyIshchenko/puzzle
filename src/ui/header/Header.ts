import AuthState from "../../features/auth/AuthState";
import Router from "../../app/router/router";

import Component from "../../shared/Component";
import Button from "../button/Button";
import { span } from "../tags";

import styles from "./Header.module.css";

export default class Header extends Component {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super(
      {
        tag: "header",
        className: styles.header,
      },
      span({ className: styles.logo, text: "Puzzle" }),
      new Button("Logout", () => {
        this.authState.logout();
        this.router.navigate("login");
      }),
    );
  }
}
