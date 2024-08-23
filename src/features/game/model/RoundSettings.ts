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
    super(defaultState);
  }

  updateSetting(setting: keyof RoundSettingsData, value: number) {
    this.state[setting] = value;
    this.updateRoundsAmount();
    this.notifySubscribers();
  }

  incrementRound() {
    const { roundNumber, totalRounds, difficultyLevel, totalLevels } =
      this.state;

    // the very last round -> do nothing?
    if (roundNumber === totalRounds - 1 && difficultyLevel === totalLevels - 1)
      return;

    // last round -> start next difficulty
    if (roundNumber === totalRounds - 1) {
      this.state.difficultyLevel += 1;
      this.state.roundNumber = 0;
      this.updateRoundsAmount();
      this.notifySubscribers();
      return;
    }

    this.state.roundNumber += 1;
    this.notifySubscribers();
  }

  private updateRoundsAmount() {
    this.state.totalRounds = LEVELS[this.state.difficultyLevel].roundsCount;
  }
}
