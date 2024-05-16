import Component from "../../util/Component";

import FormInput from "./FormInput";
import Button from "../button/Button";
import { div, label, span } from "../tags";

import { Validatable, validate } from "../../util/validation";

import styles from "./Form.module.css";

export interface TextInputParams {
  name: string;
  labelText: string;
  validationParams: Omit<Validatable, "value">;
}

interface FormField {
  fieldInput: FormInput;
  fieldErrors: Component<HTMLLabelElement>;
  params: TextInputParams;
}

export default class Form extends Component<HTMLFormElement> {
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
      const input = new FormInput(params.name);
      const labelEl = label({
        className: styles.label,
        text: params.labelText,
      });
      const errors = label({ className: styles.errors });

      const row = div({ className: styles.row }, labelEl, input, errors);

      this.textInputs.push({
        fieldInput: input,
        fieldErrors: errors,
        params,
      });

      this.append(row);
    });

    const button = new Button(this.buttonText, () => {});

    this.append(div({ className: styles.row }, button));
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
