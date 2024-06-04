import Component from "../../shared/Component";
import GameField from "../../features/game/fields/GameField";
import WordsContainer from "../../features/game/fields/WordsContainer";
import GameState from "../../features/game/model/GameState";

import styles from "./GamePage.module.css";
import GameControls from "../../features/game/controls/GameControls";
import TranslationHint from "../../features/game/hints/TranslationHint";

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
    const translationHint = new TranslationHint();
    const gameField = new GameField();
    const words = new WordsContainer();
    const controls = new GameControls();

    this.gameState.subscribe(translationHint);
    this.gameState.subscribe(gameField);
    this.gameState.subscribe(words);
    this.gameState.subscribe(controls);

    // questionable
    this.gameState.startGame();

    this.appendChildren([translationHint, gameField, words, controls]);
  }
}
