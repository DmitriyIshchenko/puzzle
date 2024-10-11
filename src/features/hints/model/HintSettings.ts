import { State } from "../../../entities/state";

export interface HintSettingsData {
  translation: boolean;
  audio: boolean;
  background: boolean;
}

const defaultState: HintSettingsData = {
  translation: true,
  audio: true,
  background: true,
};

export class HintSettings extends State<HintSettingsData> {
  constructor() {
    super(defaultState, "hintSettings");
  }

  toggleSetting(setting: keyof HintSettingsData) {
    this.state[setting] = !this.state[setting];
    this.saveState();
    this.notifySubscribers();
  }
}
