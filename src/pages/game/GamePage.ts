import Component from "../../shared/Component";
import SmallScreenWarningCard from "../../features/game/card/SmallScreenWarningCard";

import GameField from "../../features/game/fields/GameField";
import WordsPicker from "../../features/game/fields/WordsPicker";
import PaintingInfo from "../../features/game/card/PaintingInfo";
import Modal from "../../ui/modal/Modal";

import TranslationHint from "../../features/game/hints/TranslationHint";
import PronunciationHint from "../../features/game/hints/PronunciationHint";

import StageControls from "../../features/game/controls/StageControls";
import HintsControls from "../../features/game/hints/HintControls";
import RoundControls from "../../features/game/controls/RoundControls";

import RoundState from "../../features/game/model/RoundState";
import LevelsState from "../../features/game/model/LevelsState";
import HintSettings from "../../features/game/model/HintSettings";
import SmallScreenSettings from "../../features/game/model/SmallScreenSettings";

import { div } from "../../ui/tags";

import styles from "./GamePage.module.css";
import RoundStats from "../../features/game/stats/RoundStats";

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
    const translationHint = new TranslationHint(
      this.roundState,
      this.hintSettings,
    );
    const pronunciationHint = new PronunciationHint(
      this.roundState,
      this.hintSettings,
    );

    const hints = div(
      { className: styles.hints },
      pronunciationHint,
      translationHint,
    );

    return hints;
  }

  private configureControls() {
    const hintControls = new HintsControls(this.hintSettings);

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
