import Form, { TextInputParams } from "../../ui/form/Form";
import { ValidationPatterns } from "../../util/validation";

// NOTE: consider moving this to the separate file, it doesn't really belong here in form component
export interface UserCredentials {
  firstName: string;
  surname: string;
}

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
  constructor() {
    super(LOGIN_FORM_FIELDS, "Log in");

    this.addListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(e: Event) {
    e.preventDefault();

    const isValid = this.validateTextInputs();

    if (!isValid) return;

    const credentials = new FormData(this.getElement());

    LoginForm.loginUser(credentials);
  }

  // NOTE: eslint demands the use of 'this' inside class methods, made it static as a temporal measure
  // TODO: make it a regular method and navigate to the start page
  static loginUser(credentials: FormData) {
    localStorage.setItem(
      "userCredentials",

      /* TODO: this doesn't look safe enough, 
      find a way for <UserCredentials> and FormData work together.
      Ideally, get rid of using localStorage altogether due to safety concerns. 
      */
      JSON.stringify(Object.fromEntries(credentials)),
    );
  }
}
