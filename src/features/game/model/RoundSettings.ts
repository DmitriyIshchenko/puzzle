import State from "../../../app/state/StatePublisher";

// TODO: fetch this data
// TODO: fix repeating code issue
import level1 from "../../../../data/wordCollectionLevel1.json";
import level2 from "../../../../data/wordCollectionLevel2.json";
import level3 from "../../../../data/wordCollectionLevel3.json";
import level4 from "../../../../data/wordCollectionLevel4.json";
import level5 from "../../../../data/wordCollectionLevel5.json";
import level6 from "../../../../data/wordCollectionLevel6.json";

const LEVELS = [level1, level2, level3, level4, level5, level6];

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
