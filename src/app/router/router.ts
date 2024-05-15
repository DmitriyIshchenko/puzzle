import { RESOURCE_SELECTOR } from "./pages";
import AuthState from "../../features/auth/AuthState";

export interface Route {
  path: string;
  callback(resource?: string): void;
}

interface UrlData {
  path: string;
  resource: string;
}

export default class Router {
  constructor(
    private routes: Array<Route>,
    private authState: AuthState,
  ) {
    // go to the default page on load
    window.addEventListener("DOMContentLoaded", () => {
      if (!this.authState.isAuthenticated) {
        this.navigate("login");
      } else {
        this.navigate(null);
      }
    });

    window.addEventListener("popstate", (e: Event) => {
      const { target } = e;
      if (!target) return;

      // TODO: consider creating a custom event type
      const pathname = (target as Window).location.pathname.slice(1);

      // restrict access to the login page for authenticated users with back button
      if (this.authState.isAuthenticated && pathname === "login") {
        window.history.pushState(null, "", "start");
      }
    });
  }

  navigate(url: string | null) {
    if (typeof url === "string") {
      window.history.pushState(null, "", `/${url}`);
    }

    const urlString = window.location.pathname.slice(1);

    const urlData: UrlData = {
      path: "",
      resource: "",
    };
    [urlData.path = "", urlData.resource = ""] = urlString.split("/");

    if (urlData.path === "login" && this.authState.isAuthenticated) {
      this.navigate("start");
      return;
    }

    this.handleUrlChange(urlData);
  }

  handleUrlChange(urlData: UrlData) {
    const pathToFind = !urlData.resource
      ? urlData.path
      : `${urlData.path}/${RESOURCE_SELECTOR}`;

    const targetedRoute = this.routes.find(
      (route) => route.path === pathToFind,
    );

    if (!targetedRoute) {
      this.redirectToNotFound();
      return;
    }

    targetedRoute.callback(urlData.resource);
  }

  redirectToNotFound() {
    const routeNotFound = this.routes.find(
      (route) => route.path === "not-found",
    );

    if (routeNotFound) {
      this.navigate(routeNotFound.path);
    }
  }
}
