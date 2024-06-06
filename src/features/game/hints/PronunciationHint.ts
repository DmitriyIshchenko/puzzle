import Component from "../../../shared/Component";
import WaveIcon from "./WaveIcon";
import ButtonIcon from "../../../ui/button/ButtonIcon";

import GameState from "../model/GameState";
import { Observer } from "../../../shared/Observer";

import styles from "./PronunciationHint.module.css";

enum AudioStatus {
  IDLE,
  READY,
  PLAYING,
}

const BASE_URL =
  "https://github.com/rolling-scopes-school/rss-puzzle-data/raw/main";

export default class PronunciationHint extends Component implements Observer {
  private audio: HTMLAudioElement | null = null;

  private status: AudioStatus = AudioStatus.IDLE;

  private playButton: ButtonIcon;

  private icon: WaveIcon;

  constructor() {
    super({
      tag: "div",
      className: styles.pronunciation,
    });

    this.icon = new WaveIcon();

    this.playButton = new ButtonIcon(this.icon.svg, this.play.bind(this));
    this.setButtonEnablement();

    this.append(this.playButton);
  }

  update(gameState: GameState): void {
    const { audioPath } = gameState.state.hints.content;
    const audioUrl = `${BASE_URL}/${audioPath}`;

    this.createAudio(audioUrl);
  }

  private createAudio(audioUrl: string) {
    if (this.audio && this.audio.src === audioUrl) return;

    this.status = AudioStatus.IDLE;
    this.setButtonEnablement();

    this.audio = new Audio(audioUrl);

    this.audio.addEventListener("canplaythrough", () => {
      // for some reason this event fire on every new play
      if (this.status !== AudioStatus.IDLE) return;

      this.status = AudioStatus.READY;
      this.setButtonEnablement();
    });

    this.audio.addEventListener("ended", () => {
      this.status = AudioStatus.READY;
      this.setButtonEnablement();
      this.icon.stopAnimation();
    });
  }

  private play() {
    if (!this.audio) return;

    this.audio
      .play()
      .then(() => {
        this.status = AudioStatus.PLAYING;
        this.icon.startAnimation();
        this.setButtonEnablement();
      })
      .catch(() => {
        throw new Error("Audio cannot be played.");
      });
  }

  private setButtonEnablement() {
    if (this.status !== AudioStatus.READY) {
      this.playButton.setAttribute("disabled", "");
    } else {
      this.playButton.removeAttribute("disabled");
    }
  }
}
