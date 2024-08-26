import Component from "../../../shared/Component";
import RoundState from "../model/RoundState";
import AudioButton from "../../../ui/button/AudioButton";

import HintSettings from "../model/HintSettings";
import { Observer, Publisher } from "../../../shared/Observer";

import styles from "./PronunciationHint.module.css";

const BASE_URL =
  "https://github.com/rolling-scopes-school/rss-puzzle-data/raw/main";

// TODO: maybe create a generic hint class
export default class PronunciationHint extends Component implements Observer {
  private playButton: AudioButton;

  private isShown: boolean | null = null;

  constructor(roundState: RoundState, hintSettings: HintSettings) {
    super({
      tag: "div",
      className: styles.pronunciation,
    });

    roundState.subscribe(this);
    hintSettings.subscribe(this);

    this.playButton = new AudioButton(
      roundState.state.stages[roundState.state.currentStage].audio,
    );

    this.append(this.playButton);
  }

  update(publisher: Publisher): void {
    let isStageCompleted;

    if (publisher instanceof RoundState) {
      isStageCompleted = publisher.isStageCompleted();

      const { audio } = publisher.state.stages[publisher.state.currentStage];
      const audioUrl = `${BASE_URL}/${audio}`;

      this.playButton.createAudio(audioUrl);
    }

    if (publisher instanceof HintSettings) {
      this.isShown = publisher.state.audio;
    }

    if (!this.isShown) this.addClass(styles.hidden);

    if (isStageCompleted || this.isShown) this.removeClass(styles.hidden);
  }
}
