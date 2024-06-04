import Component from "../../../shared/Component";
import { Observer } from "../../../shared/Observer";
import ButtonIcon from "../../../ui/button/ButtonIcon";
import GameState from "../model/GameState";

import styles from "./HintControls.module.css";

// TODO: maybe use styled checkboxes instead of buttons
export default class HintsControls extends Component implements Observer {
  private translationButton: ButtonIcon;

  // TODO: create settings type
  // private currentSettings = {
  //   translation: true,
  // };

  constructor() {
    super({
      tag: "div",
      className: styles.controls,
    });

    this.translationButton = new ButtonIcon("bi bi-lightbulb", () => {});
    this.append(this.translationButton);
  }

  update(gameState: GameState): void {
    const isTranslationShown = gameState.state.hints.settings.translation;

    const iconName = isTranslationShown
      ? "bi bi-lightbulb-off"
      : "bi bi-lightbulb";

    this.translationButton.updateCallback(
      gameState.toggleTranslationHint.bind(gameState),
    );
    this.translationButton.updateIcon(iconName);
  }
}
