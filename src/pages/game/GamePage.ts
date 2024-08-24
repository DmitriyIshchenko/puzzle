import Component from "../../shared/Component";
import SmallScreenWarningCard from "../../features/game/card/SmallScreenWarningCard";

import GameField from "../../features/game/fields/GameField";
import WordsPicker from "../../features/game/fields/WordsPicker";
import PaintingInfo from "../../features/game/card/PaintingInfo";
import RoundState from "../../features/game/model/RoundState";

import TranslationHint from "../../features/game/hints/TranslationHint";
import PronunciationHint from "../../features/game/hints/PronunciationHint";

import GameControls from "../../features/game/controls/GameControls";
import HintsControls from "../../features/game/hints/HintControls";
import RoundControls from "../../features/game/controls/RoundControls";

import RoundSettings from "../../features/game/model/RoundSettings";
import HintSettings from "../../features/game/model/HintSettings";
import SmallScreenSettings from "../../features/game/model/SmallScreenSettings";

import { div } from "../../ui/tags";

import styles from "./GamePage.module.css";

export default class GamePage extends Component {
  roundSettings: RoundSettings;

  roundState: RoundState;

  hintSettings: HintSettings;

  smallScreenSettings: SmallScreenSettings;

  constructor() {
    super({
      tag: "main",
      className: styles.page,
    });

    this.roundSettings = new RoundSettings();
    this.roundState = new RoundState(this.roundSettings);
    this.hintSettings = new HintSettings();
    this.smallScreenSettings = new SmallScreenSettings();

    this.configure();
  }

  private configure() {
    const warning = new SmallScreenWarningCard(this.smallScreenSettings);
    const controls = this.configureControls();
    const hints = this.configurHints();
    const fields = this.configureFieds();

    this.appendChildren([warning, controls, hints, ...fields]);

    this.roundState.startRound();
    this.hintSettings.notifySubscribers();
  }

  private configureFieds() {
    const gameField = new GameField(this.roundState, this.hintSettings);
    const paintingInfo = new PaintingInfo(this.roundState);
    const wordsPicker = new WordsPicker(this.roundState, this.hintSettings);
    const roundControls = new GameControls(this.roundState);

    return [gameField, paintingInfo, wordsPicker, roundControls];
  }

  private configurHints() {
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

    const roundControls = new RoundControls(this.roundSettings);

    const controls = div(
      {
        className: styles.controls,
      },
      roundControls,
      hintControls,
    );

    return controls;
  }
}
