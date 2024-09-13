import AppLayout from "./app-layout/AppLayout";
import Router from "./router/router";
import AuthState from "../features/auth/AuthState";

import LoginPage from "../pages/login";
import StartPage from "../pages/start";
import GamePage from "../pages/game";
import NotFoundPage from "../pages/not-found";

import { Pages } from "./router/pages";

export default class App {
  appLayout: AppLayout;

  authState: AuthState;

  router: Router;

  constructor() {
    this.authState = new AuthState();
    this.router = new Router(this.createRoutes(), this.authState);
    this.appLayout = new AppLayout(this.authState, this.router);
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
          const gamePage = new GamePage();
          this.appLayout.setContent(gamePage);
          gamePage.init();
        },
      },
    ];
  }

  init() {
    document.body.append(this.appLayout.getElement());
  }
}
