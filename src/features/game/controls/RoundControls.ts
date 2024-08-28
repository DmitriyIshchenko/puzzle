import Component from "../../../shared/Component";
import { isValidSetting } from "../../../shared/helpers";
import { Observer, Publisher } from "../../../shared/Observer";
import { label, option, select } from "../../../ui/tags";
import RoundSettings from "../model/RoundSettings";

import styles from "./RoundControls.module.css";

// TODO: create generic controls class?
export default class RoundControls extends Component implements Observer {
  difficultySelect: Component;

  roundSelect: Component;

  constructor(private roundSettings: RoundSettings) {
    super({
      tag: "div",
      className: styles.controls,
    });

    this.roundSettings.subscribe(this);

    this.difficultySelect = select({
      id: "difficultyLevel",
      className: styles.select,
    });
    this.roundSelect = select({
      id: "roundNumber",
      className: styles.select,
    });

    this.configure();
  }

  private configure() {
    this.appendChildren([
      label(
        {
          text: "Difficulty",
          htmlFor: "difficultyLevel",
          className: styles.label,
        },
        this.difficultySelect,
      ),
      label(
        { text: "Round", htmlFor: "roundNumber", className: styles.label },
        this.roundSelect,
      ),
    ]);

    this.addListener("change", this.handleDifficultySelection.bind(this));

    this.generateOptions();
  }

  update(publisher: Publisher) {
    if (publisher instanceof RoundSettings) {
      this.generateOptions();
    }
  }

  private handleDifficultySelection(e: Event) {
    const { target } = e;
    if (
      target instanceof HTMLSelectElement &&
      isValidSetting(target.id, this.roundSettings.state.currentLevel)
    ) {
      this.roundSettings.updateSetting(target.id, +target.value);
    }
  }

  private generateOptions() {
    const { difficultyLevel, roundNumber, totalRounds } =
      this.roundSettings.state.currentLevel;
    const { totalLevels } = this.roundSettings.state;

    const difficultyOptions = Array.from({ length: totalLevels }, (_, index) =>
      option({
        value: `${index}`,
        text: `${index + 1}`,
        selected: index === difficultyLevel,
      }),
    );

    const roundOptions = Array.from({ length: totalRounds }, (_, index) => {
      const rating = this.roundSettings.getSavedRoundRating(
        difficultyLevel,
        index,
      );

      return option({
        value: `${index}`,
        text: `${index + 1}  ${"⭐".repeat(rating)}`,
        selected: index === roundNumber,
      });
    });

    this.difficultySelect.clear();
    this.roundSelect.clear();

    this.difficultySelect.appendChildren(difficultyOptions);
    this.roundSelect.appendChildren(roundOptions);
  }
}
