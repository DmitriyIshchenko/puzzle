import Router from "../app/router/router";
import AuthState from "../features/auth/AuthState";
import Component from "../shared/Component";

import styles from "./AppLayout.module.css";
import Header from "./header/Header";
import { main } from "./tags";

export default class AppLayout extends Component<HTMLDivElement> {
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
