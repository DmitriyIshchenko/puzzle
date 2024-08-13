import State from "../../../app/state/StatePublisher";
import { HintSettingsData } from "../types";

const defaultState: HintSettingsData = {
  translation: true,
  audio: true,
  background: true,
};

export default class HintSettings extends State<HintSettingsData> {
  constructor() {
    super(defaultState, "hintSettings");
  }

  toggleSetting(setting: keyof HintSettingsData) {
    this.state[setting] = !this.state[setting];
    this.saveState();
    this.notifySubscribers();
  }
}
