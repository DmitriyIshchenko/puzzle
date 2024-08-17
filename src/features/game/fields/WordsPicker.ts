import Component from "../../../shared/Component";
import Row from "./Row";

import { RowType } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import styles from "./WordsPicker.module.css";

export default class WordsPicker extends Component implements Observer {
  private row: Row | null = null;

  constructor(
    roundState: RoundState,
    private hintSettings: HintSettings,
  ) {
    super({
      tag: "div",
      className: styles.words,
    });

    roundState.subscribe(this);
  }

  update(publisher: Publisher) {
    if (publisher instanceof RoundState) {
      const { currentStage } = publisher.state;
      const stage = publisher.state.stages[currentStage];

      if (!this.row || stage.sentenceLength !== this.row.getChildren().length) {
        this.row = this.createRow(publisher);
      }

      this.row.fillCells(publisher.state.content.pickArea);
    }
  }

  private createRow(roundState: RoundState): Row {
    if (this.row) this.row.deleteRow();

    const row = new Row(
      RowType.PICK,
      roundState.state.content.pickArea,
      roundState.moveCard.bind(roundState),
      this.hintSettings,
    );

    this.append(row);

    return row;
  }
}
