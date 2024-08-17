import Component from "../../../shared/Component";
import { Observer, Publisher } from "../../../shared/Observer";
import { label, option, select } from "../../../ui/tags";
import RoundSettings from "../model/RoundSettings";

import styles from "./RoundControls.module.css";

function isValidSetting<T extends object>(
  key: string | number | symbol,
  state: T,
): key is keyof T {
  return key in state;
}

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

    this.addListener("change", this.handleDifficultySelection.bind(this));
  }

  private configure() {
    // TEMP hardcoded
    this.difficultySelect.appendChildren(RoundControls.generateOptions(6));
    this.roundSelect.appendChildren(RoundControls.generateOptions(10));

    this.appendChildren([
      label({
        text: "Difficulty",
        htmlFor: "difficulty",
        className: styles.label,
      }),
      this.difficultySelect,
      label({ text: "Round", htmlFor: "round", className: styles.label }),
      this.roundSelect,
    ]);
  }

  private static generateOptions(amount: number) {
    return Array.from({ length: amount }, (_, index) =>
      option({
        value: `${index}`,
        text: `${index + 1}`,
      }),
    );
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

  update(publisher: Publisher) {
    if (publisher instanceof RoundSettings) {
      RoundControls.selectOption(
        this.difficultySelect,
        publisher.state.difficultyLevel,
      );
      RoundControls.selectOption(this.roundSelect, publisher.state.roundNumber);
    }
  }
}
