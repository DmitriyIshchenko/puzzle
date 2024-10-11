import { Component, Header, main } from "../../shared";
import { Router } from "../router/router";
import { AuthState } from "../../features/auth/model/AuthState";

import styles from "./AppLayout.module.css";

export class AppLayout extends Component<HTMLDivElement> {
  private header: Header;

  private outlet: Component;

  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super({
      tag: "div",
      className: styles.app,
    });

    this.header = new Header(this.authState, this.router);
    this.outlet = main({});

    this.appendChildren([this.header, this.outlet]);
  }

  setContent(content: Component) {
    this.clear();

    // The header contains auth logic, it is necessary to it for unauthorized users
    if (this.authState.isAuthenticated) {
      this.outlet.destroy();
      this.outlet = content;
      this.appendChildren([this.header, this.outlet]);
    } else {
      this.append(content);
    }

    this.header.updateUser();
  }
}
