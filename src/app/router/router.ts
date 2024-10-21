import { Pages, RESOURCE_SELECTOR } from "./pages";
import { AuthState } from "../../features/auth/model/AuthState";

export interface Route {
  path: string;
  callback(resource?: string): void;
}

interface UrlData {
  path: string;
  resource: string;
}

export class Router {
  constructor(
    private routes: Array<Route>,
    private authState: AuthState,
  ) {
    // go to the default page on load
    window.addEventListener("DOMContentLoaded", () => {
      if (!this.authState.isAuthenticated) {
        this.navigate(Pages.LOGIN);
      } else {
        this.navigate(null);
      }
    });

    window.addEventListener("popstate", (e: Event) => {
      const { target } = e;
      if (!target) return;

      // TODO: consider creating a custom event type
      const pathname = (target as Window).location.pathname.slice(1);

      // prevent access to the random url
      if (!Object.values(Pages).includes(pathname)) {
        this.navigate(Pages.START);
      }

      // restrict access to the login page for authenticated users with back button
      if (this.authState.isAuthenticated && pathname === Pages.LOGIN) {
        window.history.pushState(null, "", Pages.START);
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

    if (urlData.path === Pages.LOGIN && this.authState.isAuthenticated) {
      this.navigate(Pages.START);
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
      (route) => route.path === Pages.NOT_FOUND,
    );

    if (routeNotFound) {
      this.navigate(routeNotFound.path);
    }
  }
}
