import AppLayout from "./ui/AppLayout";
import Router from "./app/router/router";
import AuthState from "./features/auth/AuthState";

import LoginPage from "./pages/login/LoginPage";
import StartPage from "./pages/start/StartPage";

import { Pages } from "./app/router/pages";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import GamePage from "./pages/game/GamePage";

export default class App {
  appLayout: AppLayout;

  authState: AuthState;

  router: Router;

  constructor() {
    this.authState = new AuthState();
    this.router = new Router(this.createRoutes(), this.authState);
    this.appLayout = new AppLayout(this.authState, this.router);

    document.body.append(this.appLayout.getElement());
  }

  createRoutes() {
    return [
      {
        path: "",
        callback: () => {
          this.appLayout.setContent(new StartPage(this.router));
        },
      },
      {
        path: Pages.START,
        callback: () => {
          this.appLayout.setContent(new StartPage(this.router));
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
          this.appLayout.setContent(new NotFoundPage());
        },
      },
      {
        path: Pages.GAME,
        callback: () => {
          this.appLayout.setContent(new GamePage());
        },
      },
    ];
  }
}
