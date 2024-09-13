import { State } from "../../../entities/state";
import LEVELS from "../../../../data/levels";

interface Level {
  difficultyLevel: number;
  roundNumber: number;
  totalRounds: number;
}

export interface RoundResult extends Pick<Level, "roundNumber"> {
  rating: number;
}

interface LevelsStateData {
  currentLevel: Level;
  totalLevels: number;
  completed: Map<number, RoundResult[]>;
}

const defaultState: LevelsStateData = {
  currentLevel: {
    difficultyLevel: 0,
    roundNumber: 0,
    totalRounds: LEVELS[0].roundsCount,
  },
  totalLevels: LEVELS.length,
  completed: new Map<number, RoundResult[]>(),
};

// TODO: create generic settings class?
export default class LevelsState extends State<LevelsStateData> {
  constructor() {
    super(defaultState, "levelsData");
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
    this.state.currentLevel.totalRounds =
      LEVELS[this.state.currentLevel.difficultyLevel].roundsCount;
  }

  private getIncrementedRound(): LevelsStateData {
    const { totalLevels } = this.state;
    const { roundNumber, difficultyLevel, totalRounds } =
      this.state.currentLevel;

    // the very last round → loop back to the very first round
    if (roundNumber === totalRounds - 1 && difficultyLevel === totalLevels - 1)
      return {
        ...this.state,
        currentLevel: {
          ...defaultState.currentLevel,
        },
      };

    // last round → start next difficulty
    if (roundNumber === totalRounds - 1) {
      return {
        ...this.state,
        currentLevel: {
          difficultyLevel: difficultyLevel + 1,
          roundNumber: 0,
          totalRounds: LEVELS[difficultyLevel + 1].roundsCount,
        },
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

  /* When a user has completed a round but closes the app instead of moving on to the next one, we still want to show them the next round when they return, rather than the one they have already completed.
   */
  handleCompletedRound(roundResult: RoundResult) {
    this.updateCompletedRoundRating(roundResult);

    this.saveState(this.getIncrementedRound());
  }

  private updateCompletedRoundRating(roundResult: RoundResult) {
    const { difficultyLevel } = this.state.currentLevel;
    const { roundNumber, rating: updatedRating } = roundResult;

    const targetRound = this.getSavedRound(difficultyLevel, roundNumber);

    // there is no point to save lower rating
    if (targetRound && updatedRating > targetRound.rating) {
      targetRound.rating = updatedRating;
    }

    if (!targetRound) {
      this.state.completed.set(difficultyLevel, [
        { roundNumber, rating: updatedRating },
      ]);
    }
  }

  private getSavedRound(difficultyLevel: number, roundNumber: number) {
    const rounds = this.state.completed.get(difficultyLevel) ?? [];
    return rounds.find((item) => item.roundNumber === roundNumber);
  }

  getSavedRoundRating(difficultyLevel: number, roundNumber: number): number {
    const targetRound = this.getSavedRound(difficultyLevel, roundNumber);

    if (targetRound) return targetRound.rating;

    return 0;
  }

  // redefine because maps get stringified to empty objects
  saveState(state: LevelsStateData = this.state): void {
    const completedToArray = Array.from(this.state.completed);

    const stateToSave = {
      ...state,
      completed: completedToArray,
    };

    localStorage.setItem(this.key, JSON.stringify(stateToSave));
  }

  protected loadState() {
    const stateString = localStorage.getItem(this.key);

    if (stateString) {
      const parsedState = JSON.parse(stateString) as LevelsStateData;

      const completedToMap = new Map<number, RoundResult[]>(
        parsedState.completed,
      );

      return {
        ...parsedState,
        completed: completedToMap,
      };
    }

    return defaultState;
  }
}
