import { Component, Modal } from "../../shared/ui";
import { GameField, WordsPicker, PaintingInfo } from "../../widgets/fields";
import Hints from "../../widgets/hints";
import {
  LevelsState,
  RoundState,
  HintSettings,
  StageControls,
} from "../../features/game";
import {
  SmallScreenSettings,
  SmallScreenWarningCard,
} from "../../features/warnings";
import RoundStats from "../../widgets/stats";
import Controls from "../../widgets/controls";

import styles from "./GamePage.module.css";

export default class GamePage extends Component {
  levelsState: LevelsState;

  roundState: RoundState;

  hintSettings: HintSettings;

  smallScreenSettings: SmallScreenSettings;

  modal: Modal;

  roundStats: RoundStats;

  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.levelsState = new LevelsState();
    this.roundState = new RoundState(this.levelsState);
    this.hintSettings = new HintSettings();
    this.smallScreenSettings = new SmallScreenSettings();

    this.modal = new Modal();
    this.roundStats = new RoundStats(this.roundState, this.modal);

    this.configure();
  }

  private configure() {
    const warning = new SmallScreenWarningCard(this.smallScreenSettings);
    const controls = this.configureControls();
    const hints = this.configureHints();
    const fields = this.configureFields();

    this.appendChildren([warning, controls, hints, ...fields, this.modal]);

    this.roundState.startRound();
    this.hintSettings.notifySubscribers();
  }

  private configureFields() {
    const gameField = new GameField(this.roundState, this.hintSettings);
    const paintingInfo = new PaintingInfo(this.roundState);
    const wordsPicker = new WordsPicker(this.roundState, this.hintSettings);
    const stageControls = new StageControls(this.roundState, this.modal);

    return [gameField, paintingInfo, wordsPicker, stageControls];
  }

  private configureHints() {
    return new Hints(this.roundState, this.hintSettings);
  }

  private configureControls() {
    return new Controls(this.levelsState, this.hintSettings);
  }

  init() {
    this.roundState.startRound();
    this.hintSettings.notifySubscribers();
  }
}
