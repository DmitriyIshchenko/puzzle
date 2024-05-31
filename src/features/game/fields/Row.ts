import Component from "../../../shared/Component";
import WordCard from "../card/WordCard";
import { div } from "../../../ui/tags";

import { Word, WordAction, RowType } from "../types";

import styles from "./Row.module.css";

export default class Row extends Component {
  private cells: Component[] = [];

  constructor(
    private type: RowType,
    private content: Array<Word | null>,
    private actionHandler: (action: WordAction) => void,
  ) {
    super({ className: styles.row });

    this.configure();
  }

  private configure() {
    this.cells = this.content.map(() => div({ className: styles.cell }));

    this.appendChildren(this.cells);
  }

  updateCells(content: Array<Word | null>) {
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
        cellEl.style.maxWidth = `${word.width}px`;
        cellEl.style.minWidth = `${word.width}px`;

        const card = new WordCard(word, this.actionHandler, this.type);
        card.setAttribute("data-index", index.toString());

        cell.append(card);
      }
    });
  }
}
