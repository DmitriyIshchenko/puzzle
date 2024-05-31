import Component from "../../../shared/Component";

import { Word, WordAction, RowType } from "../types";
import { assertNonNull } from "../../../shared/helpers";

import styles from "./WordCard.module.css";
import rowStyles from "../fields/Row.module.css";

const DRAG_THRESHOLD = 5;

export default class WordCard extends Component {
  private clientX: number = 0;

  private clientY: number = 0;

  private shiftX: number = 0;

  private shiftY: number = 0;

  constructor(
    data: Word,
    private actionHandler: (action: WordAction) => void,
    private initRowType: RowType,
  ) {
    super({
      className: styles.word,
      text: data.text,
    });

    this.getElement().style.width = `${data.width}px`;

    this.getElement().addEventListener(
      "mousedown",
      this.mouseDownHandler.bind(this),
    );
  }

  private mouseDownHandler(e: MouseEvent): void {
    // track coordinates to tell apart clicks from drags
    this.clientX = e.clientX;
    this.clientY = e.clientY;

    const card = this.getElement();

    // keep track of these coordinates to adjust the dragging point to any location on the card. otherwise, the center of the card will move to the cursor when clicked.
    this.shiftX = e.clientX - card.getBoundingClientRect().left;
    this.shiftY = e.clientY - card.getBoundingClientRect().top;

    // snap the card from the row
    card.style.position = "absolute";
    card.style.zIndex = "1000";
    document.body.append(card);

    // follow the cursor
    this.moveAt(e.pageX, e.pageY);
    const mouseMoveBound = this.mouseMoveHandler.bind(this);
    window.addEventListener("mousemove", mouseMoveBound);

    // adding an event listener this way is justified here, since we need exactly one 'mouseup' listener, which will be removed after triggering
    card.onmouseup = (event: MouseEvent) => {
      this.mouseUpHandler(event);

      // stops dragging
      window.removeEventListener("mousemove", mouseMoveBound);

      // deletes itself
      card.onmouseup = null;
    };
  }

  private mouseMoveHandler(e: MouseEvent): void {
    this.moveAt(e.pageX, e.pageY);
  }

  private mouseUpHandler(e: MouseEvent) {
    const isDrag =
      Math.abs(this.clientX - e.clientX) > DRAG_THRESHOLD ||
      Math.abs(this.clientY - e.clientY) > DRAG_THRESHOLD;

    if (isDrag) this.dropHandler(e);
    else this.clickHandler();

    // absolutely positioned card always gets destroyed
    this.destroy();
  }

  private clickHandler() {
    // clicking always move to the opposite word
    const oppositeRow =
      this.initRowType === RowType.PICK ? RowType.ASSEMBLE : RowType.PICK;

    const action: WordAction = {
      type: "click/move",
      payload: {
        indexFrom: +assertNonNull(this.getElement().dataset.index),
        rowFrom: this.initRowType,
        indexTo: -1, // not relevant
        rowTo: oppositeRow,
      },
    };

    this.actionHandler(action);
  }

  private dropHandler(e: MouseEvent) {
    // find the target cell underneath the dragged card
    const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
    const dropTarget = elementsBelow.find((element) =>
      element.classList.contains(rowStyles.cell),
    );

    if (!dropTarget) {
      // basically, nothing happens, but we need to synchronize the UI with the state because we snapped the card from the row, leaving a gap
      const action: WordAction = {
        type: "drop/cancel",
        payload: {
          indexFrom: +assertNonNull(this.getElement().dataset.index),
          rowFrom: this.initRowType,
          indexTo: +assertNonNull(this.getElement().dataset.index),
          rowTo: this.initRowType,
        },
      };

      this.actionHandler(action);
    }

    // TODO: create assertion function
    if (dropTarget instanceof HTMLElement) {
      const action: WordAction = {
        type: "drop/swap",
        payload: {
          indexFrom: +assertNonNull(this.getElement().dataset.index),
          rowFrom: this.initRowType,
          indexTo: +assertNonNull(dropTarget.dataset.index),
          // NOTE: had to use type casting, maybe there is an other way, but doesn't seem like it
          rowTo: assertNonNull(dropTarget.dataset.type as RowType),
        },
      };
      this.actionHandler(action);
    }
  }

  private moveAt(pageX: number, pageY: number): void {
    const card = this.getElement();

    card.style.left = `${pageX - this.shiftX}px`;
    card.style.top = `${pageY - this.shiftY}px`;
  }
}
