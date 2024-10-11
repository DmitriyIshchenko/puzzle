import {
  Component,
  label,
  option,
  select,
  isValidSetting,
} from "../../../shared";
import { Observer, Publisher } from "../../../entities/state";

import { LevelsState } from "../model/LevelsState";

import styles from "./LevelControls.module.css";

// TODO: create generic controls class?
export class LevelControls extends Component implements Observer {
  difficultySelect: Component;

  roundSelect: Component;

  constructor(private levelsState: LevelsState) {
    super({
      tag: "div",
      className: styles.controls,
    });

    this.levelsState.subscribe(this);

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
    if (publisher instanceof LevelsState) {
      this.generateOptions();
    }
  }

  private handleDifficultySelection(e: Event) {
    const { target } = e;
    if (
      target instanceof HTMLSelectElement &&
      isValidSetting(target.id, this.levelsState.state.currentLevel)
    ) {
      this.levelsState.updateSetting(target.id, +target.value);
    }
  }

  private generateOptions() {
    const { difficultyLevel, roundNumber, totalRounds } =
      this.levelsState.state.currentLevel;
    const { totalLevels } = this.levelsState.state;

    const difficultyOptions = Array.from({ length: totalLevels }, (_, index) =>
      option({
        value: `${index}`,
        text: `${index + 1}`,
        selected: index === difficultyLevel,
      }),
    );

    const roundOptions = Array.from({ length: totalRounds }, (_, index) => {
      const rating = this.levelsState.getSavedRoundRating(
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
