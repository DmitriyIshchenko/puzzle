import Component from "../../../shared/Component";
import { debounceListener } from "../../../shared/helpers";
import { Observer, Publisher } from "../../../shared/Observer";
import { div } from "../../../ui/tags";

import WordCard, { type Word } from "../card/WordCard";
import { RowType } from "../enums";

import HintSettings from "../model/HintSettings";
import RoundState from "../model/RoundState";

import styles from "./Row.module.css";

export interface RowData {
  type: RowType;
  width: number;
  height: number;
}

export default abstract class Row extends Component implements Observer {
  private cells: Array<Component> = [];

  private content: Array<Word | null> = [];

  protected roundId: string = "";

  boundResizeHandler: EventListener;

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

    this.boundResizeHandler = debounceListener(
      this.updateBackgroundPositions.bind(this),
      200,
    );

    window.addEventListener("resize", this.boundResizeHandler);
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

  private getRowData(): RowData {
    const { width, height } = this.getElement().getBoundingClientRect();
    return { type: this.type, width, height };
  }

  /* 
  4 possibilities:
    1. Word deleted (any -> null)
    2. Word added (null -> word)
    3. Word replaced with another word (word -> word)
    4. Cell is broken after a drop has been canceled
*/
  updateCells(updatedContent: Array<Word | null>) {
    updatedContent.forEach((word, index) => {
      if (!word) {
        this.cells[index].clear();
      }

      if (word) {
        const oldWord = this.content[index];
        const needsInsert =
          !oldWord ||
          word.correctPosition !== oldWord.correctPosition ||
          this.isCellBroken(index);
        if (needsInsert) this.insertCard(word, index);
      }
    });

    this.adjustEmptyCellsSizes(updatedContent);
    this.content = [...updatedContent];
  }

  // happens when a drop was canceled, meaning that the cell has children but no child nodes
  private isCellBroken(index: number) {
    const cell = this.cells[index];
    return (
      cell.getChildren().length !== 0 &&
      cell.getElement().childNodes.length === 0
    );
  }

  private insertCard(word: Word, index: number) {
    const cell = this.cells[index];
    cell.clear();
    const card = new WordCard(
      word,
      this.getRowData(),
      this.roundState,
      this.hintSettings,
    );

    card.setAttribute("data-index", index.toString());
    cell.setInlineStyles({
      minWidth: `${word.width}%`,
      maxWidth: `${word.width}%`,
    });

    cell.append(card);
  }

  private adjustEmptyCellsSizes(updatedContent: Array<Word | null>) {
    const isAdded =
      updatedContent.filter(Boolean).length >
      this.content.filter(Boolean).length;

    if (isAdded) {
      this.cells
        .filter((cell) => !cell.getChildren().length)
        .forEach((cell) => {
          cell.setInlineStyles({ minWidth: `0` });
        });
    }
  }

  deleteRow() {
    this.roundState.unsubscribe(this);
    this.hintSettings.unsubscribe(this);
    window.removeEventListener("resize", this.boundResizeHandler);

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
    const { width, height } = this.getRowData();

    this.cells.forEach((cell) => {
      const [card] = cell.getChildren();
      if (card instanceof WordCard) {
        card.calculateBackgroundPositions(width, height);
      }
    });
  }
}
