import Component from "../../../shared/Component";
import Row from "./Row";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import GameState from "../model/GameState";
import HintSettings from "../model/HintSettings";

import styles from "./WordsContainer.module.css";

export default class WordsContainer extends Component implements Observer {
  private row: Row | null = null;

  private currentStage: number = 0;

  constructor(
    gameState: GameState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.words,
    });

    gameState.subscribe(this);
  }

  update(publisher: Publisher) {
    if (publisher instanceof GameState) {
      if (!this.row) {
        this.row = this.createRow(publisher);
      }

      if (this.currentStage !== publisher.state.levels.stage) {
        this.row = this.createRow(publisher);
        this.currentStage = publisher.state.levels.stage;
      }

      this.row.fillCells(publisher.state.content.pickArea);
    }
  }

  private createRow(gameState: GameState): Row {
    if (this.row) this.row.deleteRow();

    const row = new Row(
      RowType.PICK,
      gameState.state.content.pickArea,
      gameState.actionHandler.bind(gameState),
      this.hintSettings,
    );

    this.append(row);

    return row;
  }
}
