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
    this.resetState();
    this.saveState();
  }

  get isAuthenticated() {
    return !!this.getValue("firstName");
  }
}
