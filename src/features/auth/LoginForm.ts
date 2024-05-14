import Form, { TextInputParams } from "../../ui/form/Form";
import { ValidationPatterns } from "../../util/validation";

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

    this.validateTextInputs();
  }
}
