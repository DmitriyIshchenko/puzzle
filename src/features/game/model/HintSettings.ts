import State from "../../../app/state/StatePublisher";
import { HintSettingsData } from "../types";

const initialState: HintSettingsData = {
  translation: false,
  audio: false,
};

export default class HintSettings extends State<HintSettingsData> {
  constructor() {
    super(initialState);
  }

  setSetting(setting: keyof HintSettingsData, value: boolean) {
    this.state[setting] = value;
    this.notifySubscribers();
  }
}
