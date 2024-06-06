import Component from "../../../shared/Component";
import Button from "../../../ui/button/Button";
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

  private playButton: Button;

  constructor() {
    super({
      tag: "div",
      className: styles.pronunciation,
    });

    this.playButton = new ButtonIcon("bi bi-soundwave", this.play.bind(this));
    this.updateButton();

    this.append(this.playButton);
  }

  update(gameState: GameState): void {
    const { audioPath } = gameState.state.hints.content;
    const audioUrl = `${BASE_URL}/${audioPath}`;

    this.createAudio(audioUrl);
  }

  private createAudio(audioUrl: string) {
    if (this.audio && this.audio.src === audioUrl) return;

    this.audio = new Audio(audioUrl);

    this.audio.addEventListener("canplaythrough", () => {
      // for some reason this event fire on every new play
      if (this.status !== AudioStatus.IDLE) return;

      this.status = AudioStatus.READY;
      this.updateButton();
    });

    this.audio.addEventListener("ended", () => {
      this.status = AudioStatus.READY;
      this.updateButton();
    });
  }

  private play() {
    if (!this.audio) return;

    this.audio
      .play()
      .then(() => {
        this.status = AudioStatus.PLAYING;
        this.updateButton();
      })
      .catch(() => {
        throw new Error("Audio cannot be played.");
      });
  }

  private updateButton() {
    if (this.status !== AudioStatus.READY) {
      this.playButton.setAttribute("disabled", "");
    } else {
      this.playButton.removeAttribute("disabled");
    }
  }
}
