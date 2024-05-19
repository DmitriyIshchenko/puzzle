import Component from "../../shared/Component";
import { div } from "../../ui/tags";

import { Observer } from "../../shared/Observer";

import styles from "./GameField.module.css";
import GameState from "./GameState";
import WordCard from "./WordCard";
import { calculateCardWidth } from "../../shared/helpers";

export default class GameField extends Component implements Observer {
  constructor() {
    super({
      tag: "div",
      className: styles.field,
    });
  }

  update(gameState: GameState) {
    this.clear();

    const cards = gameState.state.rowContent.map((word) => {
      const card = new WordCard({
        text: word,
        width: calculateCardWidth(gameState.state.sentence, word),
      });

      // TODO: it is probably a good idea to use event delegation instead
      card.addListener("click", () => {
        gameState.discardWord(word);
      });

      return card;
    });

    this.append(div({ className: styles.row }, ...cards));
  }
}
