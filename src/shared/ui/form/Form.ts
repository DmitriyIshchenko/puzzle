import { Component } from "../base/Component";

import { Input } from "../input/Input";
import { Button } from "../button/Button";
import { div, label, span } from "../base/tags";

import { Validatable, validate } from "../../lib/validation";

import styles from "./Form.module.css";

export interface TextInputParams {
  name: string;
  labelText: string;
  validationParams: Omit<Validatable, "value">;
}

interface FormField {
  fieldInput: Input;
  fieldErrors: Component<HTMLLabelElement>;
  params: TextInputParams;
}

export class Form extends Component<HTMLFormElement> {
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

  private configure() {
    this.populateForm();
  }

  private populateForm() {
    this.fieldsParams.forEach((params) => {
      this.append(this.createFormField(params));
    });

    const button = new Button(this.buttonText, null);

    this.append(div({ className: styles.row }, button));
  }

  private createFormField(params: TextInputParams) {
    const input = new Input({ name: params.name });
    const labelEl = label({
      className: styles.label,
      text: params.labelText,
    });
    const errors = label({ className: styles.errors });

    this.textInputs.push({
      fieldInput: input,
      fieldErrors: errors,
      params,
    });

    return div({ className: styles.row }, labelEl, input, errors);
  }

  validateTextInputs(): boolean {
    let isFormValid = true;
    this.textInputs.forEach(({ fieldInput, fieldErrors, params }) => {
      fieldErrors.clear();

      const errors = validate({
        value: fieldInput.getValue(),
        ...params.validationParams,
      });

      const isInputValid = errors.length === 0;
      if (!isInputValid) {
        isFormValid = false;
      }

      Form.setErrors(fieldErrors, errors);

      fieldInput.setValidityStyles(isInputValid);
    });

    return isFormValid;
  }

  // all regular non-static method have to use 'this' according to typescript
  private static setErrors(
    fieldErrorsEl: Component<HTMLLabelElement>,
    errors: Array<string>,
  ) {
    fieldErrorsEl.appendChildren(
      errors.map((message) => span({ className: styles.error, text: message })),
    );
  }
}
