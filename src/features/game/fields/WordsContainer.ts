import Component from "../../../shared/Component";
import Row from "./Row";
import GameState from "../model/GameState";

import { RowType } from "../types";
import { Observer } from "../../../shared/Observer";

import styles from "./WordsContainer.module.css";

export default class WordsContainer extends Component implements Observer {
  row: Row | null = null;

  constructor() {
    super({
      tag: "div",
      className: styles.words,
    });
  }

  update(gameState: GameState) {
    this.clear();
    this.row = new Row(
      RowType.PICK,
      gameState.state.content.pickArea,
      gameState.actionHandler.bind(gameState),
    );

    this.append(this.row);

    this.row.updateCells(gameState.state.content.pickArea);
  }
}
