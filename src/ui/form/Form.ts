import BaseComponent from "../../util/BaseComponent";

import FormRow from "./FormRow";
import FormInput from "./FormInput";
import FormLabel from "./FormLabel";
import Button from "../button/Button";
import FormErrorsLabel from "./FormErrorsLabel";

import { Validatable } from "../../util/validation";

import styles from "./Form.module.css";

export interface TextInputParams {
  name: string;
  labelText: string;
  validationParams: Omit<Validatable, "value">;
}

interface FormField {
  fieldInput: FormInput;
  fieldLabel: FormLabel;
  fieldErrors: FormErrorsLabel;
  params: TextInputParams;
}

export default class Form extends BaseComponent<HTMLFormElement> {
  protected textInputs: Array<FormField> = [];

  constructor(
    private fieldsParams: Array<TextInputParams>,
    private buttonText: string,
  ) {
    super({
      tag: "form",
      className: styles.form,
    });

    this.configure();
  }

  configure() {
    this.populateForm();
  }

  populateForm() {
    this.fieldsParams.forEach((params) => {
      const label = new FormLabel(params.labelText);
      const input = new FormInput(params.name);
      const errors = new FormErrorsLabel();

      const row = new FormRow(label, input, errors);

      this.textInputs.push({
        fieldLabel: label,
        fieldInput: input,
        fieldErrors: errors,
        params,
      });

      this.append(row);
    });

    const button = new Button(this.buttonText, () => {});

    this.append(new FormRow(button));
  }
}
