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
    this.fillSelectsWithOptions(this.roundSettings);

    this.appendChildren([
      label({
        text: "Difficulty",
        htmlFor: "difficultyLevel",
        className: styles.label,
      }),
      this.difficultySelect,
      label({ text: "Round", htmlFor: "roundNumber", className: styles.label }),
      this.roundSelect,
    ]);

    this.addListener("change", this.handleDifficultySelection.bind(this));
  }

  update(publisher: Publisher) {
    if (publisher instanceof RoundSettings) {
      this.fillSelectsWithOptions(publisher);

      RoundControls.selectOption(
        this.difficultySelect,
        publisher.state.difficultyLevel,
      );
      RoundControls.selectOption(this.roundSelect, publisher.state.roundNumber);
    }
  }

  // TODO: refactor to optimize the amount of DOM operations
  private fillSelectsWithOptions(roundSettings: RoundSettings) {
    const { totalLevels, totalRounds } = roundSettings.state;

    this.difficultySelect.clear();
    this.roundSelect.clear();

    this.difficultySelect.appendChildren(
      RoundControls.generateOptions(totalLevels),
    );
    this.roundSelect.appendChildren(RoundControls.generateOptions(totalRounds));
  }

  private handleDifficultySelection(e: Event) {
    const { target } = e;
    if (
      target instanceof HTMLSelectElement &&
      isValidSetting(target.id, this.roundSettings.state)
    ) {
      this.roundSettings.updateSetting(target.id, +target.value);
    }
  }

  private static selectOption(selectComponent: Component, index: number) {
    const options = selectComponent.getChildren();

    options.forEach((item) => {
      item.removeAttribute("selected");
    });

    options[index].setAttribute("selected", "true");
  }

  private static generateOptions(amount: number) {
    return Array.from({ length: amount }, (_, index) =>
      option({
        value: `${index}`,
        text: `${index + 1}`,
      }),
    );
  }
}
