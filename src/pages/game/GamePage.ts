import Component from "../../shared/Component";
import GameField from "../../features/game/fields/GameField";
import WordsPicker from "../../features/game/fields/WordsPicker";
import RoundState from "../../features/game/model/RoundState";

import styles from "./GamePage.module.css";
import GameControls from "../../features/game/controls/GameControls";
import TranslationHint from "../../features/game/hints/TranslationHint";
import PronunciationHint from "../../features/game/hints/PronunciationHint";
import HintsControls from "../../features/game/hints/HintControls";
import HintSettings from "../../features/game/model/HintSettings";
import RoundControls from "../../features/game/controls/RoundControls";
import RoundSettings from "../../features/game/model/RoundSettings";

import { div } from "../../ui/tags";

export default class GamePage extends Component {
  roundSettings: RoundSettings;

  roundState: RoundState;

  hintSettings: HintSettings;

  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.roundSettings = new RoundSettings();
    this.roundState = new RoundState(this.roundSettings);
    this.hintSettings = new HintSettings();

    this.configure();
  }

  private configure() {
    const controls = this.configureControls();
    const hints = this.configurHints();
    const fields = this.configureFieds();

    this.appendChildren([controls, hints, ...fields]);

    this.roundState.startRound();
    this.hintSettings.notifySubscribers();
  }

  private configureFieds() {
    const gameField = new GameField(this.roundState, this.hintSettings);
    const wordsPicker = new WordsPicker(this.roundState, this.hintSettings);
    const roundControls = new GameControls(this.roundState);

    return [gameField, wordsPicker, roundControls];
  }

  private configurHints() {
    const translationHint = new TranslationHint(
      this.roundState,
      this.hintSettings,
    );
    const pronunciationHint = new PronunciationHint(
      this.roundState,
      this.hintSettings,
    );

    const hints = div(
      { className: styles.hints },
      pronunciationHint,
      translationHint,
    );

    return hints;
  }

  private configureControls() {
    const hintControls = new HintsControls(this.hintSettings);

    const roundControls = new RoundControls(this.roundSettings);

    const controls = div(
      {
        className: styles.controls,
      },
      roundControls,
      hintControls,
    );

    return controls;
  }
}
