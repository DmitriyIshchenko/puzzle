import Component from "../../../shared/Component";

import { Word, MoveCardAction, RowType } from "../types";

import { div, span } from "../../../ui/tags";
import { assertNonNull } from "../../../shared/helpers";

import styles from "./WordCard.module.css";
import rowStyles from "../fields/Row.module.css";

const DRAG_THRESHOLD = 2;

const IMAGES_BASE_URL =
  "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images";

// TODO: this class is too bloated. extract the Drag & Drop functionality into the Draggable class
export default class WordCard extends Component {
  private clientX: number = 0;

  private clientY: number = 0;

  private shiftX: number = 0;

  private shiftY: number = 0;

  private lastDropTarget: HTMLElement | null = null;

  constructor(
    private data: Word,
    private actionHandler: (action: MoveCardAction) => void,
    private initRowType: RowType,
    private isBackgroundDisplayed: boolean | null,
  ) {
    const lastWordClassName = data.isLast ? styles.last : "";
    const firstWordClassName = data.correctPosition === 0 ? styles.first : "";
    const classNames = [styles.word, firstWordClassName, lastWordClassName];

    super({
      className: classNames.join(" "),
    });

    this.getElement().addEventListener(
      "mousedown",
      this.mouseDownHandler.bind(this),
    );

    this.configure();
  }

  private configure() {
    const content = div(
      { className: styles.content },
      span({ className: styles.text, text: this.data.text }),
    );
    const convex = div({ className: styles.convex });

    this.appendChildren([content, convex]);
    this.setBackground(this.isBackgroundDisplayed);
  }

  setBackground(isHintEnabled: boolean | null) {
    this.getChildren().forEach((child) => {
      const element = child.getElement();
      element.style.backgroundImage = isHintEnabled
        ? `url(${IMAGES_BASE_URL}/${this.data.image})`
        : "none";
    });
  }

  /*
   * The math can be tricky: the width of the card is specified in percentages,
   * but the background-position in percentages behaves differently than when
   * it's set in pixels. It's easier to calculate the actual width of the card
   * in pixels rather than dealing with the current setup.
   */
  /* TODO: Change the formula to avoid excessive calculations and to work with percentages. */

  public calculateBackgroundPositions(rowWidth: number, rowHeight: number) {
    const [content, convex] = this.getChildren();

    const rowOffsetY = this.data.stage * rowHeight;
    const contentOffsetX = (rowWidth * this.data.offset) / 100;

    const convexHeight = convex.getElement().getBoundingClientRect().height;

    // the convex starts at the same place as the next piece (in pixels)
    const convexOffsetX =
      (rowWidth * (this.data.offset + this.data.width)) / 100;
    // align the convex in the middle, the same as  `top: 50%; transformY: -50%`
    const convexOffsetY = rowOffsetY + rowHeight / 2 - convexHeight / 2;

    const contentStyles = {
      backgroundSize: `${rowWidth}px`,
      backgroundPosition: `-${contentOffsetX}px -${rowOffsetY}px`,
    };

    const convexStyles = {
      backgroundSize: `${rowWidth}px`,
      backgroundPosition: `-${convexOffsetX}px -${convexOffsetY}px`,
    };

    content.setInlineStyles(contentStyles);
    convex.setInlineStyles(convexStyles);
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
    card.style.cursor = "grabbing";
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

    const dropTarget = WordCard.findDroppableCell(e.clientX, e.clientY);

    if (!(dropTarget instanceof HTMLElement)) return;

    if (this.lastDropTarget !== dropTarget) {
      // leaving (cell -> null or other cell )
      if (this.lastDropTarget) {
        this.resetDropTargetHoverStyles();
      }
      this.lastDropTarget = dropTarget;

      // entering (null -> cell)
      this.setDropTargetHoverStyles();
    }
  }

  private mouseUpHandler(e: MouseEvent) {
    // otherwise cell stays highlighted after clicking on previously dragged card
    this.resetDropTargetHoverStyles();

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

    const action: MoveCardAction = {
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
    // cannot use this.lastDropTarget here, because drop canceling wouldn't work
    const dropTarget = WordCard.findDroppableCell(e.clientX, e.clientY);

    if (!dropTarget) {
      // basically, nothing happens, but we need to synchronize the UI with the state because we snapped the card from the row, leaving a gap
      const action: MoveCardAction = {
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

    if (dropTarget) {
      const action: MoveCardAction = {
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

  private setDropTargetHoverStyles() {
    if (this.lastDropTarget) {
      this.lastDropTarget.style.background = "var(--color-brand-200)";
    }
  }

  private resetDropTargetHoverStyles() {
    if (this.lastDropTarget) {
      this.lastDropTarget.style.background = "";
    }
  }

  // NOTE: I don't know about this, but eslint insists
  private static findDroppableCell(
    clientX: number,
    clientY: number,
  ): HTMLElement | null {
    // find the target cell underneath the dragged card
    const elementsBelow = document.elementsFromPoint(clientX, clientY);
    const dropTarget = elementsBelow.find((element) =>
      element.classList.contains(rowStyles.cell),
    );

    return dropTarget instanceof HTMLElement ? dropTarget : null;
  }
}
