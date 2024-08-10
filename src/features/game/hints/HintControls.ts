import Component from "../../../shared/Component";
import HintSettings from "../model/HintSettings";
import { HintSettingsData } from "../types";

import { Observer, Publisher } from "../../../shared/Observer";
import { i, input, label } from "../../../ui/tags";

import styles from "./HintControls.module.css";

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

// type guard
function isKeyOfHintSettingsData(key: string): key is keyof HintSettingsData {
  return key in ({} as HintSettingsData);
}

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
        i({ className: iconClasses.translation.on }),
        input({ type: "checkbox", name: "translation" }),
      ),
      label(
        { className: styles.button },
        i({ className: iconClasses.audio.on }),
        input({ type: "checkbox", name: "audio" }),
      ),
    ]);

    this.addListener("change", this.handleChangeSetting.bind(this));
  }

  private handleChangeSetting(e: Event) {
    const { target } = e;
    if (
      target instanceof HTMLInputElement &&
      isKeyOfHintSettingsData(target.name)
    ) {
      this.hintSettings.toggleSetting(target.name);
    }
  }

  update(publisher: Publisher): void {
    if (publisher instanceof HintSettings) {
      this.getChildren().forEach((labelChild) => {
        const [icon, checkbox] = labelChild.getChildren();
        const checkboxEl = checkbox.getElement();

        if (
          checkboxEl instanceof HTMLInputElement &&
          isKeyOfHintSettingsData(checkboxEl.name)
        ) {
          // update value
          checkboxEl.checked = publisher.state[checkboxEl.name];

          // update icon
          icon.resetClasses(
            checkboxEl.checked
              ? iconClasses[checkboxEl.name].on
              : iconClasses[checkboxEl.name].off,
          );
        }
      });
    }
  }
}
