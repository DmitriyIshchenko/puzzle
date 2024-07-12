import Component from "../../../shared/Component";
import WaveIcon from "./WaveIcon";
import ButtonIcon from "../../../ui/button/ButtonIcon";

import GameState from "../model/GameState";
import HintSettings from "../model/HintSettings";
import { Observer } from "../../../shared/Observer";

import styles from "./PronunciationHint.module.css";

enum AudioStatus {
  IDLE,
  READY,
  PLAYING,
}

const BASE_URL =
  "https://github.com/rolling-scopes-school/rss-puzzle-data/raw/main";

// TODO: maybe create a generic hint class
export default class PronunciationHint extends Component implements Observer {
  private audio: HTMLAudioElement | null = null;

  private status: AudioStatus = AudioStatus.IDLE;

  private playButton: ButtonIcon;

  private icon: WaveIcon;

  constructor(gameState: GameState, hintSettings: HintSettings) {
    super({
      tag: "div",
      className: styles.pronunciation,
    });

    gameState.subscribe(this);
    hintSettings.subscribe(this);

    this.icon = new WaveIcon();

    this.playButton = new ButtonIcon(this.icon.svg, this.play.bind(this));
    this.updateButtonEnablement();

    this.append(this.playButton);
  }

  update(gameState: GameState): void {
    const isShown = gameState.state.hints.settings.audio;

    if (isShown || gameState.isStageCompleted()) {
      this.removeClass(styles.hidden);
    } else {
      this.addClass(styles.hidden);
    }

    const { audioPath } = gameState.state.hints.content;
    const audioUrl = `${BASE_URL}/${audioPath}`;

    this.createAudio(audioUrl);
  }

  private createAudio(audioUrl: string) {
    if (this.audio && this.audio.src === audioUrl) return;

    this.updatePlaybackStatus(AudioStatus.IDLE);
    this.audio = new Audio(audioUrl);

    this.audio.addEventListener("canplaythrough", () => {
      // for some reason this event fire on every new play
      if (this.status !== AudioStatus.IDLE) return;

      this.updatePlaybackStatus(AudioStatus.READY);
    });

    this.audio.addEventListener("ended", () => {
      this.updatePlaybackStatus(AudioStatus.READY);
      this.icon.stopAnimation();
    });
  }

  private play() {
    if (!this.audio) return;

    this.audio
      .play()
      .then(() => {
        this.updatePlaybackStatus(AudioStatus.PLAYING);
        this.icon.startAnimation();
      })
      .catch(() => {
        throw new Error("Audio cannot be played.");
      });
  }

  private updatePlaybackStatus(status: AudioStatus) {
    this.status = status;
    this.updateButtonEnablement();
  }

  private updateButtonEnablement() {
    if (this.status !== AudioStatus.READY) {
      this.playButton.setAttribute("disabled", "");
    } else {
      this.playButton.removeAttribute("disabled");
    }
  }
}
