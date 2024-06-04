import type Component from "../../shared/Component";

import Button from "./Button";
import { i } from "../tags";

import styles from "./ButtonIcon.module.css";

export default class ButtonIcon extends Button {
  private icon: Component;

  constructor(
    private iconName: string,
    onClick: EventListener,
  ) {
    super("", onClick, styles.button);

    this.icon = i({ className: this.iconName });
    this.append(this.icon);
  }

  updateIcon(newIconName: string) {
    this.icon.getElement().className = "";

    // this.icon.getElement().className = newIconName;

    this.icon.addClass(newIconName);
  }
}
