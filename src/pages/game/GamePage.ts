import Component from "../../shared/Component";
import GameField from "../../features/game/fields/GameField";
import WordsContainer from "../../features/game/fields/WordsContainer";
import GameState from "../../features/game/model/GameState";

import styles from "./GamePage.module.css";
import GameControls from "../../features/game/controls/GameControls";
import TranslationHint from "../../features/game/hints/TranslationHint";
import PronunciationHint from "../../features/game/hints/PronunciationHint";
import HintsControls from "../../features/game/hints/HintControls";
import { div } from "../../ui/tags";
import HintSettings from "../../features/game/model/HintSettings";

export default class GamePage extends Component {
  gameState: GameState;

  hintSettings: HintSettings;

  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.gameState = new GameState();
    this.hintSettings = new HintSettings();

    this.configure();
  }

  private configure() {
    // TODO: now I have to drill hint settings all the way down to the WordCard, find a better way
    const gameField = new GameField(this.gameState, this.hintSettings);
    const words = new WordsContainer(this.gameState, this.hintSettings);

    const stageControls = new GameControls(this.gameState);
    const hintControls = new HintsControls(this.hintSettings);
    const translationHint = new TranslationHint(
      this.gameState,
      this.hintSettings,
    );
    const pronunciationHint = new PronunciationHint(
      this.gameState,
      this.hintSettings,
    );

    const hints = div(
      { className: styles.hints },
      pronunciationHint,
      translationHint,
    );

    this.appendChildren([hintControls, hints, gameField, words, stageControls]);

    // questionable
    this.gameState.notifySubscribers();
    this.hintSettings.notifySubscribers();
  }
}
