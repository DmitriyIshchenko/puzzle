import Form, { TextInputParams } from "../../ui/form/Form";

const LOGIN_FORM_FIELDS: Array<TextInputParams> = [
  {
    name: "firstName",
    labelText: "First name",
    validationParams: {
      required: true,
      minLength: 3,
      capitalized: true,
      pattern: {
        regexp: /^([A-z]|-)+$/,
        errorMessage: "Only English letters and hyphens are allowed.",
      },
    },
  },
  {
    name: "surname",
    labelText: "Surname",
    validationParams: {
      required: true,
      minLength: 4,
      capitalized: true,
      pattern: {
        regexp: /^([A-z]|-)+$/,
        errorMessage: "Only English letters and hyphens are allowed.",
      },
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
