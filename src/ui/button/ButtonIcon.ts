import Button from "./Button";
import { i } from "../tags";

import styles from "./ButtonIcon.module.css";

export default class ButtonIcon extends Button {
  constructor(
    icon: string | SVGSVGElement,
    onClick: EventListener | null,
    className?: string,
  ) {
    super("", onClick, `${styles.button} ${className}`);

    this.updateIcon(icon);
  }

  updateIcon(icon: string | SVGSVGElement) {
    this.clear();

    if (typeof icon === "string") {
      this.append(i({ className: icon }));
    } else {
      this.getElement().append(icon);
    }
  }
}
