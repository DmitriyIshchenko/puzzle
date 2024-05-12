import BaseComponent from "../../util/BaseComponent";

import FormInput from "./FormInput";
import FormLabel from "./FormLabel";

import styles from "./Form.module.css";
import FormRow from "./FormRow";
import Button from "../button/Button";

export interface TextInputParams {
  name: string;
  labelText: string;
  isRequired: boolean;
}

export default class Form extends BaseComponent<HTMLFormElement> {
  constructor(
    private fieldsParams: Array<TextInputParams>,
    private buttonText: string,
    private onSubmit: EventListener,
  ) {
    super({
      tag: "form",
      className: styles.form,
    });

    this.configure();
  }

  configure() {
    this.populateForm();
    this.addListener("submit", this.onSubmit);
  }

  populateForm() {
    this.fieldsParams.forEach((params) => {
      const label = new FormLabel(params.labelText);
      const input = new FormInput(params.name, params.isRequired);
      const row = new FormRow(label, input);

      this.append(row);
    });

    const button = new Button(this.buttonText, this.onSubmit);

    this.append(new FormRow(button));
  }
}
