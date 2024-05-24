import Component from "../../../shared/Component";
import { div } from "../../../ui/tags";
import WordCard, { Word } from "../card/WordCard";

import styles from "./Row.module.css";

export default class Row extends Component {
  private cells: Component[] = [];

  constructor(
    private content: Array<Word | null>,
    private callback: (word: Word) => void,
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

      // reset cell
      cell.clear();
      cellEl.style.maxWidth = `none`;
      cellEl.style.minWidth = `0`;

      if (word) {
        cellEl.style.maxWidth = `${word.width.toString()}%`;
        cellEl.style.minWidth = `${word.width.toString()}%`;

        const card = new WordCard(word);
        card.addListener("click", () => {
          this.callback(word);
        });
        cell.append(card);
      }
    });
  }
}
