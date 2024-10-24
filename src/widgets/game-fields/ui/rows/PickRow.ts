import { Publisher } from "../../../../entities/state";
import { HintSettings } from "../../../../features/hints";
import { RoundState, RowType } from "../../../../features/levels";
import { Row } from "./Row";

export class PickRow extends Row {
  constructor(
    public stageNumber: number,
    roundState: RoundState,
    hintSettings: HintSettings,
  ) {
    super(RowType.PICK, stageNumber, roundState, hintSettings);
  }

  update(publisher: Publisher): void {
    if (publisher instanceof RoundState) {
      if (this.stageNumber !== publisher.state.currentStage) return;

      if (this.roundId !== publisher.state.id) return;

      const { pickArea } = publisher.state.content;

      this.updateCells(pickArea);
    }

    if (publisher instanceof HintSettings) {
      this.toggleRowBackgrounds(publisher.state.background);
    }
  }
}
