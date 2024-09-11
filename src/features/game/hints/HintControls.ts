import Component from "../../../shared/Component";
import HintSettings, { HintSettingsData } from "../model/HintSettings";

import { Observer, Publisher } from "../../../shared/Observer";
import { i, input, label } from "../../../ui/tags";
import { isValidSetting } from "../../../shared/helpers";

import styles from "./HintControls.module.css";

// Record maps each key to an object
const iconClasses: Record<keyof HintSettingsData, { on: string; off: string }> =
  {
    translation: {
      on: "bi bi-lightbulb",
      off: "bi bi-lightbulb-off",
    },
    audio: {
      on: "bi bi-volume-up",
      off: "bi bi-volume-mute",
    },
    background: {
      on: "bi bi-eye",
      off: "bi bi-eye-slash",
    },
  };

export default class HintsControls extends Component implements Observer {
  constructor(private hintSettings: HintSettings) {
    super({
      tag: "form",
      className: styles.controls,
    });

    hintSettings.subscribe(this);

    this.appendChildren([
      label(
        { className: styles.button },
        i({ className: iconClasses.background.on }),
        input({ type: "checkbox", id: "background", hidden: true }),
      ),
      label(
        { className: styles.button },
        i({ className: iconClasses.audio.on }),
        input({ type: "checkbox", id: "audio", hidden: true }),
      ),
      label(
        { className: styles.button },
        i({ className: iconClasses.translation.on }),
        input({ type: "checkbox", id: "translation", hidden: true }),
      ),
    ]);

    this.addListener("change", this.handleChangeSetting.bind(this));
  }

  private handleChangeSetting(e: Event) {
    const { target } = e;
    if (
      target instanceof HTMLInputElement &&
      isValidSetting(target.id, this.hintSettings.state)
    ) {
      this.hintSettings.toggleSetting(target.id);
    }
  }

  update(publisher: Publisher): void {
    if (publisher instanceof HintSettings) {
      this.getChildren().forEach((labelChild) => {
        const [icon, checkbox] = labelChild.getChildren();
        const checkboxEl = checkbox.getElement();

        if (
          checkboxEl instanceof HTMLInputElement &&
          isValidSetting(checkboxEl.id, this.hintSettings.state)
        ) {
          // update value
          checkboxEl.checked = publisher.state[checkboxEl.id];

          // update icon
          icon.resetClasses(
            checkboxEl.checked
              ? iconClasses[checkboxEl.id].on
              : iconClasses[checkboxEl.id].off,
          );
        }
      });
    }
  }
}
