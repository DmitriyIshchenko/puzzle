import Component from "../../../shared/Component";
import { Observer, Publisher } from "../../../shared/Observer";
import { div } from "../../../ui/tags";
import WordCard from "../card/WordCard";
import HintSettings from "../model/HintSettings";
import RoundState from "../model/RoundState";
import { RowType, Word } from "../types";

import styles from "./Row.module.css";

export default abstract class Row extends Component implements Observer {
  private cells: Array<Component> = [];

  private content: Array<Word | null> = [];

  protected roundId: string = "";

  constructor(
    protected type: RowType,
    public stageNumber: number,
    protected roundState: RoundState,
    protected hintSettings: HintSettings,
  ) {
    super({ className: styles.row });

    this.roundState.subscribe(this);
    this.hintSettings.subscribe(this);

    this.roundId = this.roundState.state.id;

    this.configure();

    window.addEventListener(
      "resize",
      this.updateBackgroundPositions.bind(this),
    );
  }

  configure() {
    this.createCells();
  }

  abstract update(state: Publisher): void;

  createCells() {
    const rowLength =
      this.roundState.state.stages[this.stageNumber].sentenceLength;

    this.cells = Array.from({ length: rowLength }, (_, index) => {
      const cell = div({ className: styles.cell });
      cell.setAttribute("data-index", index.toString());
      cell.setAttribute("data-type", this.type);

      return cell;
    });

    this.content = Array.from({ length: rowLength }, () => null);

    this.appendChildren(this.cells);
  }

  getRowData() {
    return {
      type: this.type,
      width: this.getElement().getBoundingClientRect().width,
      height: this.getElement().getBoundingClientRect().height,
    };
  }

  // TODO: create a function to find differences between arrays/objects
  // FIX: handle drop cancel (insert the card back)
  updateCells(updatedContent: Array<Word | null>) {
    updatedContent.forEach((newWord, index) => {
      if (newWord?.correctPosition !== this.content[index]?.correctPosition) {
        this.cells[index].clear();

        if (newWord) {
          const card = new WordCard(
            newWord,
            this.getRowData(),
            this.roundState,
            this.hintSettings,
          );

          card.setAttribute("data-index", index.toString());
          this.cells[index].setInlineStyles({
            minWidth: `${newWord.width}%`,
            maxWidth: `${newWord.width}%`,
          });

          this.cells[index].append(card);
        }
      }
    });

    this.adjustEmptyCellsSizes(updatedContent);
    this.content = [...updatedContent];
  }

  private adjustEmptyCellsSizes(updatedContent: Array<Word | null>) {
    const isAdded =
      updatedContent.filter((item) => item).length >
      this.content.filter((item) => item).length;

    if (isAdded) {
      const emptyCells = this.cells.filter(
        (cell) => !cell.getChildren().length,
      );
      emptyCells.forEach((cell) => {
        cell.setInlineStyles({
          minWidth: `0`,
        });
      });
    }
  }

  deleteRow() {
    this.roundState.unsubscribe(this);
    this.hintSettings.unsubscribe(this);

    this.destroy();
  }

  protected toggleRowBackgrounds(isShown: boolean) {
    this.cells.forEach((cell) => {
      const [card] = cell.getChildren();
      if (card instanceof WordCard) {
        card.setBackground(isShown);
      }
    });
  }

  private updateBackgroundPositions() {
    const { width: rowWidth, height: rowHeight } =
      this.getElement().getBoundingClientRect();

    this.cells.forEach((cell) => {
      const [card] = cell.getChildren();
      if (card instanceof WordCard) {
        card.calculateBackgroundPositions(rowWidth, rowHeight);
      }
    });
  }
}
