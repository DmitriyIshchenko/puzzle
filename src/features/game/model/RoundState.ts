import State from "../../../app/state/StatePublisher";
import RoundSettings from "./RoundSettings";
import { Observer, Publisher } from "../../../shared/Observer";

import { Round, RowType, Stage, StageStatus } from "../types";
import {
  generateStageWords,
  prepareRound,
  RATING_THRESHOLDS,
} from "../../../shared/helpers";

export interface MoveCardAction {
  type: string;
  payload: {
    indexFrom: number;
    rowFrom: RowType;
    indexTo: number;
    rowTo: RowType;
  };
}

export default class RoundState extends State<Round> implements Observer {
  constructor(private roundSettings: RoundSettings) {
    const { difficultyLevel, roundNumber } = roundSettings.state.currentLevel;
    super(prepareRound(difficultyLevel, roundNumber));

    this.roundSettings.subscribe(this);
  }

  update(publisher: Publisher) {
    if (publisher instanceof RoundSettings) {
      const { difficultyLevel, roundNumber } = publisher.state.currentLevel;
      this.state = prepareRound(difficultyLevel, roundNumber);
      this.startRound();
    }
  }

  startStage(stageNumber: number): void {
    const { imageSrc } = this.state.painting;

    this.state.currentStage = stageNumber;

    this.state.content.pickArea = generateStageWords(
      this.state.stages[stageNumber],
      imageSrc,
    );

    this.state.content.assembleArea = Array.from(
      { length: this.state.content.pickArea.length },
      () => null,
    );

    this.notifySubscribers();
  }

  startNextStage(): void {
    if (this.state.currentStage === this.state.stages.length - 1) {
      this.roundSettings.incrementRound();
      return;
    }

    this.startStage(this.state.currentStage + 1);
  }

  startRound(): void {
    this.startStage(0);

    // This allows users to resume the game from the last visited round instead of the last completed one. Remove this line if it is not needed
    this.roundSettings.saveState();
  }

  moveCard(action: MoveCardAction): void {
    const { rowTo, rowFrom, indexTo, indexFrom } = action.payload;
    const areaTo = this.state.content[rowTo];
    const areaFrom = this.state.content[rowFrom];

    switch (action.type) {
      case "drop/swap": {
        // swap
        [areaFrom[indexFrom], areaTo[indexTo]] = [
          areaTo[indexTo],
          areaFrom[indexFrom],
        ];
        break;
      }
      case "drop/cancel":
        break;
      case "click/move": {
        // insert in the first empty cell
        const insertPosition = areaTo.indexOf(null);
        areaTo[insertPosition] = areaFrom[indexFrom];
        areaFrom[indexFrom] = null;
        break;
      }
      default:
        break;
    }

    this.setStageStatus(StageStatus.NOT_COMPLETED);

    this.notifySubscribers();
  }

  verifyAnswer(): void {
    const isCorrect = this.state.content.assembleArea.every((word, index) =>
      word ? word.correctPosition === index : false,
    );

    this.setStageStatus(
      isCorrect ? StageStatus.CORRECT : StageStatus.INCORRECT,
    );

    // This will allow users to start the next round when they return, if they close the app before progressing.
    if (this.isRoundCompleted()) {
      this.updateRoundResults();
      this.roundSettings.handleCompletedRound(this.state.results);
    }

    this.notifySubscribers();
  }

  autocompleteStage(): void {
    this.state.content.assembleArea = this.state.content.pickArea
      .concat(this.state.content.assembleArea)
      .filter(Boolean)
      .filter(Boolean)
      .sort((a, b) => (a && b ? a.correctPosition - b.correctPosition : 0));

    this.state.content.pickArea.fill(null);

    this.setStageStatus(StageStatus.AUTOCOMPLETED);

    // This will allow users to start the next round when they return, if they close the app before progressing.
    if (this.isRoundCompleted()) {
      this.updateRoundResults();
      this.roundSettings.handleCompletedRound(this.state.results);
    }

    this.notifySubscribers();
  }

  setStageStatus(updatedStatus: StageStatus): void {
    this.state.stages[this.state.currentStage].status = updatedStatus;
  }

  isStageCompleted(
    stage: Stage = this.state.stages[this.state.currentStage],
  ): boolean {
    return [StageStatus.AUTOCOMPLETED, StageStatus.CORRECT].includes(
      stage.status,
    );
  }

  isAssembled() {
    return this.state.content.assembleArea.every((word) => word);
  }

  isRoundCompleted(): boolean {
    return this.state.stages.every((stage) => this.isStageCompleted(stage));
  }

  private updateRoundResults() {
    const { stages } = this.state;

    let rating = 0;

    const correctRatio =
      stages.filter((stage) => stage.status === StageStatus.CORRECT).length /
      stages.length;

    if (correctRatio >= RATING_THRESHOLDS.passed) rating = 1;
    if (correctRatio >= RATING_THRESHOLDS.good) rating = 2;
    if (correctRatio === RATING_THRESHOLDS.perfect) rating = 3;

    this.state.results = { ...this.state.results, rating };
  }
}
