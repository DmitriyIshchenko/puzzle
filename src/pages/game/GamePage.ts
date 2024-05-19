import Component from "../../shared/Component";
import GameField from "../../features/game/GameField";
import WordsContainer from "../../features/game/WordsContainer";
import GameState from "../../features/game/GameState";

import styles from "./GamePage.module.css";

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

    this.gameState.subscribe(gameField);
    this.gameState.subscribe(words);

    // questionable
    this.gameState.startGame();

    this.appendChildren([gameField, words]);
  }
}
