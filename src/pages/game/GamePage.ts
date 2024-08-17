import Component from "../../shared/Component";
import GameField from "../../features/game/fields/GameField";
import WordsContainer from "../../features/game/fields/WordsContainer";
import RoundState from "../../features/game/model/RoundState";

import styles from "./GamePage.module.css";
import GameControls from "../../features/game/controls/GameControls";
import TranslationHint from "../../features/game/hints/TranslationHint";
import PronunciationHint from "../../features/game/hints/PronunciationHint";
import HintsControls from "../../features/game/hints/HintControls";
import { div } from "../../ui/tags";
import HintSettings from "../../features/game/model/HintSettings";

export default class GamePage extends Component {
  roundState: RoundState;

  hintSettings: HintSettings;

  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.roundState = new RoundState();
    this.hintSettings = new HintSettings();

    this.configure();
  }

  private configure() {
    const gameField = new GameField(this.roundState, this.hintSettings);
    const wordsPicker = new WordsContainer(this.roundState, this.hintSettings);
    const stageControls = new GameControls(this.roundState);
    const hintControls = new HintsControls(this.hintSettings);
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

    this.appendChildren([
      hintControls,
      hints,
      gameField,
      wordsPicker,
      stageControls,
    ]);

    this.roundState.startRound();
    this.hintSettings.notifySubscribers();
  }
}
