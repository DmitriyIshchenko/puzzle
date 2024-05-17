import AuthState from "../../features/auth/AuthState";
import Router from "../../app/router/router";

import Component from "../../shared/Component";
import Button from "../button/Button";
import { div, span } from "../tags";

import styles from "./Header.module.css";

export default class Header extends Component {
  private userEl: Component;

  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super({
      tag: "header",
      className: styles.header,
    });

    this.userEl = span({
      className: styles.user,
    });

    this.configure();
  }

  private configure() {
    this.append(
      div(
        { className: styles.inner },
        span({ className: styles.logo, text: "Puzzle" }),
        this.userEl,
        new Button("Logout", () => {
          this.authState.logout();
          this.router.navigate("login");
        }),
      ),
    );
  }

  private getUserName() {
    return `Welcome, 
    ${this.authState.getValue("firstName")} ${this.authState.getValue("surname")}!`;
  }

  updateUser() {
    this.userEl.setTextContent(this.getUserName());
  }
}
