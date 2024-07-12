import Component from "../../../shared/Component";
import ButtonIcon from "../../../ui/button/ButtonIcon";

import GameState from "../model/GameState";
import HintSettings from "../model/HintSettings";
import { Observer, Publisher } from "../../../shared/Observer";

import styles from "./HintControls.module.css";

// TODO: maybe use styled checkboxes instead of buttons
// TODO: create settings type

export default class HintsControls extends Component implements Observer {
  private translationButton: ButtonIcon;

  private pronunciationButton: ButtonIcon;

  constructor(gameState: GameState, hintSettings: HintSettings) {
    super({
      tag: "div",
      className: styles.controls,
    });

    gameState.subscribe(this);
    hintSettings.subscribe(this);

    this.translationButton = new ButtonIcon("bi bi-lightbulb", () => {});
    this.pronunciationButton = new ButtonIcon("bi bi-volume-up", () => {});

    this.appendChildren([this.pronunciationButton, this.translationButton]);
  }

  update(state: Publisher): void {
    if (state instanceof GameState) {
      this.updateTranslationButton(state);
      this.updatePronunciationButton(state);
    }
  }

  // TODO: apply DRY
  private updateTranslationButton(gameState: GameState) {
    let isTranslationShown = gameState.state.hints.settings.translation;

    if (gameState.isStageCompleted()) {
      isTranslationShown = true;
      this.translationButton.setAttribute("disabled", "");
    } else {
      this.translationButton.removeAttribute("disabled");
    }

    const iconName = isTranslationShown
      ? "bi bi-lightbulb-off"
      : "bi bi-lightbulb";

    this.translationButton.updateCallback(
      gameState.toggleTranslationHint.bind(gameState),
    );
    this.translationButton.updateIcon(iconName);
  }

  private updatePronunciationButton(gameState: GameState) {
    let isAudioShown = gameState.state.hints.settings.audio;

    if (gameState.isStageCompleted()) {
      isAudioShown = true;
      this.pronunciationButton.setAttribute("disabled", "");
    } else {
      this.pronunciationButton.removeAttribute("disabled");
    }

    const iconName = isAudioShown ? "bi bi-volume-mute" : "bi bi-volume-up";

    this.pronunciationButton.updateCallback(
      gameState.togglePronunciationHint.bind(gameState),
    );
    this.pronunciationButton.updateIcon(iconName);
  }
}
