import State from "../../app/state/State";
import { UserCredentials } from "./types";

const AUTH_KEY = "userCredentials";

export default class AuthState extends State<UserCredentials> {
  constructor() {
    super(AUTH_KEY);
  }

  login(credentials: UserCredentials) {
    // TODO: this smells. There is a lot of entries all over the app, consider creating helper function to extract entries from object
    const entries = Object.entries(credentials) as [string, string][];

    entries.forEach(([name, value]) => this.setValue(name, value));
    this.saveState();
  }

  logout() {
    // NOTE: although it may seem somewhat unrelated to do it within this state, I believe it's a much simpler solution than trying to synchronize multiple states/components, so I decided to go with it
    localStorage.removeItem("hintSettings");

    this.resetState();
    this.saveState();
  }

  get isAuthenticated() {
    return !!this.getValue("firstName");
  }
}
