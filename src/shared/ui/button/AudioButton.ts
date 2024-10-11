import { WaveIcon } from "./WaveIcon";
import { Component } from "../base/Component";

import styles from "./Button.module.css";
import stylesRound from "./ButtonIcon.module.css";
import { BASE_URL } from "../../api/urls";

enum AudioStatus {
  IDLE,
  READY,
  PLAYING,
}

export class AudioButton extends Component<HTMLButtonElement> {
  private audio: HTMLAudioElement | null = null;

  private status: AudioStatus = AudioStatus.IDLE;

  private icon: WaveIcon;

  constructor(audioUrl: string) {
    super({
      tag: "button",
      type: "button",
      className: `${styles.button} ${stylesRound.button}`,
    });

    this.icon = new WaveIcon();

    this.getElement().append(this.icon.svg);

    this.createAudio(`${BASE_URL}/${audioUrl}`);

    this.addListener("click", this.play.bind(this));
  }

  createAudio(audioUrl: string) {
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

    this.toggleAttribute("disabled", this.status !== AudioStatus.READY);
  }
}
