import { Publisher } from "../../../shared/Observer";
import Button from "../../../ui/button/Button";
import MessageCard, { MessageType } from "../../../ui/message/Message";
import SmallScreenSettings from "../model/SmallScreenSettings";

import styles from "../../../ui/message/Message.module.css";

export default class SmallScreenWarning extends MessageCard {
  constructor(private smallScreenSettings: SmallScreenSettings) {
    const button = new Button(
      "Got it, never show again",
      () => {
        smallScreenSettings.toggleSetting("isWarningDisplayed");
      },
      styles.button,
    );

    super(
      "Your screen might be a bit too small to fully enjoy this game. Try rotating your device to landscape mode or using a different device for a better experience! :)",
      MessageType.WARNING,
      button,
    );

    this.smallScreenSettings.subscribe(this);

    this.toggleVisibility(smallScreenSettings.state.isWarningDisplayed);
  }

  update(publisher: Publisher) {
    if (publisher instanceof SmallScreenSettings) {
      this.toggleVisibility(publisher.state.isWarningDisplayed);
    }
  }

  private toggleVisibility(isWarningDisplayed: boolean) {
    if (isWarningDisplayed) {
      this.removeClass(styles.hidden);
    } else this.addClass(styles.hidden);
  }
}