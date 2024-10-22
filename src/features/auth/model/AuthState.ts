import { State } from "../../../entities/state";

interface UserCredentials {
  firstName: string;
  surname: string;
}

const defaultState: UserCredentials = {
  firstName: "",
  surname: "",
};

export class AuthState extends State<UserCredentials> {
  constructor() {
    super(defaultState, "userCredentials");
  }

  login(userCredentials: UserCredentials) {
    this.saveState(userCredentials);
    this.state = userCredentials;
  }

  logout() {
    localStorage.removeItem("hintSettings");

    this.state = defaultState;
    this.saveState();
  }

  get isAuthenticated() {
    return !!this.state.surname;
  }
}
