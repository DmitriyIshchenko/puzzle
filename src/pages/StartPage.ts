import Router from "../app/router/router";
import AuthState from "../features/auth/AuthState";
import Button from "../ui/button/Button";
import Span from "../ui/form/Span";
import BaseComponent from "../util/BaseComponent";

export default class StartPage extends BaseComponent<HTMLElement> {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super({
      tag: "main",
      className: "start",
    });

    this.configure();
  }

  configure() {
    const message = `Welcome`;
    const logoutBtn = new Button("logout", () => {
      this.authState.logout();
      this.router.navigate("login");
    });
    this.appendChildren([new Span("text", message), logoutBtn]);
  }
}
