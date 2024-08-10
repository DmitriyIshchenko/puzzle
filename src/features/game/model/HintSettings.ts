import State from "../../../app/state/StatePublisher";
import { HintSettingsData } from "../types";

const initialState: HintSettingsData = {
  translation: true,
  audio: true,
};

export default class HintSettings extends State<HintSettingsData> {
  constructor() {
    super(initialState);
  }

  toggleSetting(setting: keyof HintSettingsData) {
    this.state[setting] = !this.state[setting];
    this.notifySubscribers();
  }
}
