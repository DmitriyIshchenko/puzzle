import Component from "../../shared/Component";
import ButtonIcon from "../button/ButtonIcon";
import { div } from "../tags";

import styles from "./Modal.module.css";

export default class Modal extends Component<HTMLDialogElement> {
  private content: Component;

  constructor() {
    super({
      tag: "dialog",
      ariaLabel: "statistics",
      className: styles.modal,
    });

    const controlForm = new Component<HTMLFormElement>(
      {
        tag: "form",
        method: "dialog",
        className: styles.form,
      },
      new ButtonIcon(`bi bi-x-lg`, null, styles.close),
    );

    this.content = div({ className: styles.content });

    controlForm.append(this.content);

    this.append(controlForm);
  }

  show() {
    this.getElement().showModal();
  }

  updateContent(component: Component) {
    this.content.clear();

    this.content.append(component);
  }
}
