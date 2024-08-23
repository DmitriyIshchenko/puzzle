import Component from "../../../shared/Component";
import WordCard from "../card/WordCard";

import { Word, MoveCardAction, RowType, StageStatus } from "../types";
import { Observer, Publisher } from "../../../shared/Observer";
import HintSettings from "../model/HintSettings";

import { div } from "../../../ui/tags";

import styles from "./Row.module.css";

export default class Row extends Component implements Observer {
  private cells: Component[] = [];

  // need this to prevent reset on cell updating
  private isBackgroundDisplayed: boolean | null = null;

  constructor(
    private type: RowType,
    private content: Array<Word | null>,
    private actionHandler: (action: MoveCardAction) => void,
    private hintSettings: HintSettings,
  ) {
    super({ className: styles.row });

    this.hintSettings.subscribe(this);

    this.configure();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  private configure() {
    this.cells = this.content.map(() => div({ className: styles.cell }));

    this.appendChildren(this.cells);
    // TODO: I have doubts about this, there is probably a better way
    this.update(this.hintSettings);

    if (this.type === RowType.PICK) this.getElement().style.height = "100%";
  }

  update(publisher: Publisher) {
    if (publisher instanceof HintSettings) {
      this.isBackgroundDisplayed = publisher.state.background;

      this.toggleRowBackgrounds(this.isBackgroundDisplayed);
    }
  }

  private handleResize() {
    this.updateBackgroundPositions().catch((err: unknown) => {
      console.error(err);
    });
  }

  // TODO: this method needs a lot of refactoring
  fillCells(content: Array<Word | null>) {
    this.cells.forEach((cell, index) => {
      const word = content[index];
      const cellEl = this.cells[index].getElement();
      cell.setAttribute("data-index", index.toString());
      cell.setAttribute("data-type", this.type);

      // reset cell
      cell.clear();
      cellEl.style.maxWidth = `none`;
      cellEl.style.minWidth = `0`;

      if (word) {
        cellEl.style.maxWidth = `${word.width}%`;
        cellEl.style.minWidth = `${word.width}%`;

        const card = new WordCard(
          word,
          this.actionHandler,
          this.type,
          this.isBackgroundDisplayed,
        );
        card.setAttribute("data-index", index.toString());

        cell.append(card);
      }
    });
  }

  updateStatusStyles(status: StageStatus) {
    // reset styles
    this.removeClass(styles.correct);
    this.removeClass(styles.incorrect);

    if ([StageStatus.CORRECT, StageStatus.AUTOCOMPLETED].includes(status)) {
      this.addClass(styles.correct);

      this.toggleRowBackgrounds(true);

      // solved rows always display background, so the row doesn't have to be affected by hint settings anymore
      this.hintSettings.unsubscribe(this);
    }

    if (status === StageStatus.INCORRECT) this.addClass(styles.incorrect);
  }

  private toggleRowBackgrounds(isShown: boolean) {
    this.cells.forEach((cell) => {
      const [card] = cell.getChildren();
      if (card instanceof WordCard) {
        card.setBackground(isShown);
      }
    });
  }

  async updateBackgroundPositions() {
    const { width: rowWidth, height: rowHeight } =
      this.getElement().getBoundingClientRect();

    this.cells.forEach((cell) => {
      const [card] = cell.getChildren();
      if (card instanceof WordCard) {
        card.calculateBackgroundPositions(rowWidth, rowHeight);
      }
    });
  }

  deleteRow() {
    // there should be no "dead" objects subscribed to the publisher
    this.hintSettings.unsubscribe(this);
    this.destroy();
  }

  activateRow() {
    this.addClass(styles.active);
  }

  deactivateRow() {
    this.removeClass(styles.active);
  }
}
