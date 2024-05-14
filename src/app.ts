import LoginPage from "./pages/LoginPage";
import AppLayout from "./ui/AppLayout";
import Span from "./ui/form/Span";
import { UserCredentials } from "./features/auth/LoginForm";

export default class App {
  appLayout: AppLayout;

  constructor() {
    this.appLayout = new AppLayout();

    document.body.append(this.appLayout.getElement());

    this.configure();
  }

  configure() {
    const userCredentialsString = localStorage.getItem("userCredentials");

    if (userCredentialsString) {
      // NOTE: it looks like there is no way around typecasting with JSON.parse()
      const credentials = JSON.parse(userCredentialsString) as UserCredentials;

      // TODO: redirect to start page instead
      this.appLayout.setContent(
        new Span("", `Welcome, ${credentials.firstName}`),
      );
    } else {
      this.appLayout.setContent(new LoginPage());
    }
  }
}
