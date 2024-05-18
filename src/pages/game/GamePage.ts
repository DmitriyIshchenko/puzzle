import Component from "../../shared/Component";
import GameField from "../../features/game/GameField";
import WordsContainer from "../../features/game/WordsContainer";

import wordsData from "../../../data/words.json";

import styles from "./GamePage.module.css";

export default class GamePage extends Component {
  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });
    this.configure();
  }

  private configure() {
    const gameField = new GameField();

    // TEMP
    const words = new WordsContainer(wordsData.rounds[0].words[0].textExample);

    this.appendChildren([gameField, words]);
  }
}
