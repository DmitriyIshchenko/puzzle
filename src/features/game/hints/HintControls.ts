import Component from "../../../shared/Component";
import HintSettings from "../model/HintSettings";
import { HintSettingsData } from "../types";

import { Observer, Publisher } from "../../../shared/Observer";
import { i, input, label } from "../../../ui/tags";

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

  // NOTE: this is a type guard defined as a class method (this way I can get access to the state object for checking). I don't really know whether it is a good idea or a bad one.
  private isValidSetting(key: string): key is keyof HintSettingsData {
    return key in this.hintSettings.state;
  }

  private handleChangeSetting(e: Event) {
    const { target } = e;
    if (target instanceof HTMLInputElement && this.isValidSetting(target.id)) {
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
          this.isValidSetting(checkboxEl.id)
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
