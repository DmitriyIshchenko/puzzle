import { Component, Modal, div } from "../../shared/ui";

import { GameField, WordsPicker } from "../../widgets/fields";
import PaintingInfo from "../../features/game/card/PaintingInfo";

import Hints from "../../widgets/hints";
import { HintSettings, HintControls } from "../../features/hints";

import {
  LevelsState,
  RoundState,
  StageControls,
  RoundControls,
} from "../../features/game";

import {
  SmallScreenSettings,
  SmallScreenWarningCard,
} from "../../features/warnings";

import styles from "./GamePage.module.css";
import RoundStats from "../../widgets/stats";

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
    const roundControls = new StageControls(this.roundState, this.modal);

    return [gameField, paintingInfo, wordsPicker, roundControls];
  }

  private configureHints() {
    return new Hints(this.roundState, this.hintSettings);
  }

  private configureControls() {
    const hintControls = new HintControls(this.hintSettings);

    const roundControls = new RoundControls(this.levelsState);

    const controls = div(
      {
        className: styles.controls,
      },
      roundControls,
      hintControls,
    );

    return controls;
  }

  init() {
    this.roundState.startRound();
    this.hintSettings.notifySubscribers();
  }
}
