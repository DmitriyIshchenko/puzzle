import State from "../../../app/state/StatePublisher";

interface RoundSettingsData {
  difficultyLevel: number;
  roundNumber: number;
}

const defaultState: RoundSettingsData = {
  difficultyLevel: 0,
  roundNumber: 0,
};

// TODO: create generic settings class?
export default class RoundSettings extends State<RoundSettingsData> {
  constructor() {
    super(defaultState);
  }

  updateSetting(setting: keyof RoundSettingsData, value: number) {
    this.state[setting] = value;
    this.notifySubscribers();
  }
}
