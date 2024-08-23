import State from "../../../app/state/StatePublisher";

interface SmallScreenSettingsData {
  isWarningDisplayed: boolean;
}

const defaultState: SmallScreenSettingsData = {
  isWarningDisplayed: true,
};

export default class SmallScreenSettings extends State<SmallScreenSettingsData> {
  constructor() {
    super(defaultState, "smallScreenWarning");
  }

  toggleSetting(setting: keyof SmallScreenSettingsData) {
    this.state[setting] = !this.state[setting];
    this.saveState();
    this.notifySubscribers();
  }
}
