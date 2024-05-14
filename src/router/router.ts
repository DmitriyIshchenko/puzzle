import { RESOURCE_SELECTOR } from "./pages";

export interface Route {
  path: string;
  callback(resource?: string): void;
}

interface UrlData {
  path: string;
  resource: string;
}

export default class Router {
  constructor(private routes: Array<Route>) {
    // go to the default page on load
    window.addEventListener("DOMContentLoaded", () => {
      this.navigate(null);
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

    this.handleUrlChange(urlData);
  }

  handleUrlChange(urlData: UrlData) {
    const pathToFind = urlData.resource
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
