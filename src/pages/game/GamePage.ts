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

export default class GamePage extends Component {
  gameState: GameState;

  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.gameState = new GameState();

    this.configure();
  }

  private configure() {
    const gameField = new GameField();
    const words = new WordsContainer();
    const stageControls = new GameControls();
    const hintControls = new HintsControls();
    const translationHint = new TranslationHint();
    const pronunciationHint = new PronunciationHint();

    const hints = div(
      { className: styles.hints },
      pronunciationHint,
      translationHint,
    );

    const observers = [
      hintControls,
      translationHint,
      pronunciationHint,
      gameField,
      words,
      stageControls,
    ];

    observers.forEach((observer) => {
      this.gameState.subscribe(observer);
    });

    this.appendChildren([hintControls, hints, gameField, words, stageControls]);

    // questionable
    this.gameState.startGame();
  }
}
