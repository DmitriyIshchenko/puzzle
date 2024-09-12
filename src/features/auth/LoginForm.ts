import Router from "../../app/router/router";
import AuthState from "./AuthState";
import { Form, TextInputParams } from "../../shared/ui";
import { ValidationPatterns } from "../../shared/validation";

const LOGIN_FORM_FIELDS: Array<TextInputParams> = [
  {
    name: "firstName",
    labelText: "First name",
    validationParams: {
      required: true,
      minLength: 3,
      capitalized: true,
      pattern: ValidationPatterns.ONLY_ENGLISH_LETTERS,
    },
  },
  {
    name: "surname",
    labelText: "Surname",
    validationParams: {
      required: true,
      minLength: 4,
      capitalized: true,
      pattern: ValidationPatterns.ONLY_ENGLISH_LETTERS,
    },
  },
];

export default class LoginForm extends Form {
  constructor(
    private authState: AuthState,
    private router: Router,
  ) {
    super(LOGIN_FORM_FIELDS, "Log in");

    this.addListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    const isValid = this.validateTextInputs();

    if (!isValid) return;

    const formData = new FormData(this.getElement());

    // TODO: temp solution, find a way to convert form data to user credentials type
    this.authState.login({
      firstName: <string>formData.get("firstName"),
      surname: <string>formData.get("surname"),
    });

    // TODO: consider redirecting to previous page instead, like this: random page -> login page -> back to the page
    this.router.navigate("start");
  }
}
