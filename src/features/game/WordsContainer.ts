import Component from "../../shared/Component";
import WordCard from "./WordCard";

import { Observer } from "../../shared/Observer";

import styles from "./WordsContainer.module.css";
import GameState from "./GameState";

import { calculateCardWidth } from "../../shared/helpers";

export default class WordsContainer extends Component implements Observer {
  constructor() {
    super({
      tag: "div",
      className: styles.words,
    });
  }

  update(gameState: GameState) {
    this.clear();

    const cards = gameState.state.pickAreaContent.map((word) => {
      const card = new WordCard({
        text: word,
        width: calculateCardWidth(gameState.state.sentence, word),
      });

      // TODO: it is probably a good idea to use event delegation instead
      card.addListener("click", () => {
        gameState.pickWord(word);
      });

      return card;
    });

    this.appendChildren(cards);
  }
}
