import State from "../../../app/state/StatePublisher";
import LEVELS from "../../../../data/levels";

interface RoundSettingsData {
  difficultyLevel: number;
  roundNumber: number;
  totalLevels: number;
  totalRounds: number;
}

const defaultState: RoundSettingsData = {
  difficultyLevel: 0,
  roundNumber: 0,
  totalLevels: LEVELS.length,
  totalRounds: LEVELS[0].roundsCount,
};

// TODO: create generic settings class?
export default class RoundSettings extends State<RoundSettingsData> {
  constructor() {
    super(defaultState, "levels");
  }

  updateSetting(setting: keyof RoundSettingsData, value: number) {
    this.state[setting] = value;

    // when the difficulty level is updated, reset to the first round, as the number of rounds differs between difficulties
    if (setting === "difficultyLevel") {
      this.state.roundNumber = 0;
    }

    this.updateRoundsAmount();
    this.notifySubscribers();
  }

  private updateRoundsAmount() {
    this.state.totalRounds = LEVELS[this.state.difficultyLevel].roundsCount;
  }

  private getIncrementedRound(): RoundSettingsData {
    const { roundNumber, totalRounds, difficultyLevel, totalLevels } =
      this.state;

    // the very last round → loop back to the very first round
    if (roundNumber === totalRounds - 1 && difficultyLevel === totalLevels - 1)
      return defaultState;

    // last round → start next difficulty
    if (roundNumber === totalRounds - 1) {
      return {
        ...this.state,
        difficultyLevel: difficultyLevel + 1,
        roundNumber: 0,
        totalRounds: LEVELS[this.state.difficultyLevel + 1].roundsCount,
      };
    }

    // regular case
    return {
      ...this.state,
      roundNumber: roundNumber + 1,
    };
  }

  incrementRound() {
    this.state = this.getIncrementedRound();
    this.notifySubscribers();
  }

  /* This is somewhat of an edge case: when a user has completed a round 
  but closes the app instead of moving on to the next one,
  we still want to show them the next round when they return, 
  rather than the one they have already completed.
  This means we just need to save the incremented round to the state, 
  but we don't want to update the UI unless the user clicks on 'Continue'
  */
  saveNextRound() {
    this.saveState(this.getIncrementedRound());
  }
}
