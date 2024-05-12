import Form, { TextInputParams } from "../../ui/form/Form";

export default class LoginForm extends Form {
  constructor() {
    const fieldsParams: Array<TextInputParams> = [
      {
        name: "firstName",
        labelText: "First name",
        isRequired: true,
      },
      {
        name: "surname",
        labelText: "Surname",
        isRequired: true,
      },
    ];

    super(fieldsParams, "Log in", () => {});
  }
}
