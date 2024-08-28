import State from "../../../app/state/StatePublisher";
import LEVELS from "../../../../data/levels";

interface Level {
  difficultyLevel: number;
  roundNumber: number;
}

interface RoundSettingsData {
  currentLevel: Level;
  totalLevels: number;
  totalRounds: number;
  completed: Map<number, number[]>;
}

const defaultState: RoundSettingsData = {
  currentLevel: {
    difficultyLevel: 0,
    roundNumber: 0,
  },
  totalLevels: LEVELS.length,
  totalRounds: LEVELS[0].roundsCount,
  completed: new Map<number, number[]>(),
};

// TODO: create generic settings class?
export default class RoundSettings extends State<RoundSettingsData> {
  constructor() {
    super(defaultState, "levels");
  }

  updateSetting(setting: keyof Level, value: number) {
    this.state.currentLevel[setting] = value;

    // when the difficulty level is updated, reset to the first round, as the number of rounds differs between difficulties
    if (setting === "difficultyLevel") {
      this.state.currentLevel.roundNumber = 0;
    }

    this.updateRoundsAmount();
    this.notifySubscribers();
  }

  private updateRoundsAmount() {
    this.state.totalRounds =
      LEVELS[this.state.currentLevel.difficultyLevel].roundsCount;
  }

  private getIncrementedRound(): RoundSettingsData {
    const { totalRounds, totalLevels } = this.state;
    const { roundNumber, difficultyLevel } = this.state.currentLevel;

    // the very last round → loop back to the very first round
    if (roundNumber === totalRounds - 1 && difficultyLevel === totalLevels - 1)
      return {
        ...this.state,
        currentLevel: {
          difficultyLevel: 0,
          roundNumber: 0,
        },
      };

    // last round → start next difficulty
    if (roundNumber === totalRounds - 1) {
      return {
        ...this.state,
        currentLevel: {
          difficultyLevel: difficultyLevel + 1,
          roundNumber: 0,
        },
        totalRounds:
          LEVELS[this.state.currentLevel.difficultyLevel + 1].roundsCount,
      };
    }

    // regular case
    return {
      ...this.state,
      currentLevel: {
        ...this.state.currentLevel,
        roundNumber: roundNumber + 1,
      },
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
  handleCompletedRound() {
    const { difficultyLevel, roundNumber } = this.state.currentLevel;

    const roundsArray = this.state.completed.get(difficultyLevel);

    if (roundsArray) {
      roundsArray.push(roundNumber);
    } else {
      this.state.completed.set(difficultyLevel, [roundNumber]);
    }

    this.saveState(this.getIncrementedRound());
  }
}
