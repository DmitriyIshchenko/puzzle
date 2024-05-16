import AppLayout from "./ui/AppLayout";
import Router from "./app/router/router";
import AuthState from "./features/auth/AuthState";

import LoginPage from "./pages/LoginPage";
import StartPage from "./pages/StartPage";

import { Pages } from "./app/router/pages";
import NotFoundPage from "./pages/NotFoundPage";

export default class App {
  appLayout: AppLayout;

  authState: AuthState;

  router: Router;

  constructor() {
    this.appLayout = new AppLayout();
    this.authState = new AuthState();
    this.router = new Router(this.createRoutes(), this.authState);

    document.body.append(this.appLayout.getElement());
  }

  createRoutes() {
    return [
      {
        path: "",
        callback: () => {
          this.appLayout.setContent(new StartPage(this.authState, this.router));
        },
      },
      {
        path: Pages.START,
        callback: () => {
          this.appLayout.setContent(new StartPage(this.authState, this.router));
        },
      },
      {
        path: Pages.LOGIN,
        callback: () => {
          this.appLayout.setContent(new LoginPage(this.authState, this.router));
        },
      },
      {
        path: Pages.NOT_FOUND,
        callback: () => {
          this.appLayout.setContent(
            new NotFoundPage(this.authState, this.router),
          );
        },
      },
    ];
  }
}
