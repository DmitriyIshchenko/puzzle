import LoginPage from "./pages/LoginPage";
import AppLayout from "./ui/AppLayout";

export default class App {
  appLayout: AppLayout;

  constructor() {
    this.appLayout = new AppLayout();
    this.appLayout.setContent(new LoginPage());

    document.body.append(this.appLayout.getElement());
  }
}
