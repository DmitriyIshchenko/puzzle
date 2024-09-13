import Row from "./Row";
import { RowType } from "./RowType";
import RoundState from "../model/RoundState";
import HintSettings from "../model/HintSettings";

import { Publisher } from "../../../entities/state";
import { StageStatus } from "../model/StageStatus";

import styles from "./Row.module.css";

export default class AssembleRow extends Row {
  constructor(
    stageNumber: number,
    roundState: RoundState,
    hintSettings: HintSettings,
  ) {
    super(RowType.ASSEMBLE, stageNumber, roundState, hintSettings);

    if (stageNumber === 0) {
      this.activateRow();
    }
  }

  update(publisher: Publisher): void {
    if (publisher instanceof RoundState) {
      if (this.stageNumber !== publisher.state.currentStage) {
        this.deactivateRow();
        return;
      }

      if (this.roundId !== publisher.state.id) return;

      const { assembleArea } = publisher.state.content;
      this.activateRow();
      this.updateCells(assembleArea);
      this.updateStatusStyles(
        this.roundState.state.stages[this.roundState.state.currentStage].status,
      );
    }

    if (publisher instanceof HintSettings) {
      this.toggleRowBackgrounds(publisher.state.background);
    }
  }

  updateStatusStyles(status: StageStatus) {
    // reset styles
    this.removeClass(styles.correct);
    this.removeClass(styles.incorrect);

    if (status !== StageStatus.NOT_COMPLETED) this.addClass(styles[status]);

    if (
      StageStatus.CORRECT === status ||
      StageStatus.AUTOCOMPLETED === status
    ) {
      this.toggleRowBackgrounds(true);

      // solved rows always display background, so the row doesn't have to be affected by hint settings anymore
      this.hintSettings.unsubscribe(this);
    }
  }

  activateRow() {
    this.addClass(styles.active);
  }

  deactivateRow() {
    this.removeClass(styles.active);
  }
}
