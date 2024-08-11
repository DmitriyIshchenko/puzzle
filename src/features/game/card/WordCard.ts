import Component from "../../../shared/Component";

import { Word, WordAction, RowType } from "../types";

import { div, span } from "../../../ui/tags";
import { assertNonNull } from "../../../shared/helpers";

import styles from "./WordCard.module.css";
import rowStyles from "../fields/Row.module.css";

const DRAG_THRESHOLD = 2;

const IMAGES_BASE_URL =
  "https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images";
const CARD_HEIGHT = 40;
const CONVEX_HEIGHT = 20;

export default class WordCard extends Component {
  private clientX: number = 0;

  private clientY: number = 0;

  private shiftX: number = 0;

  private shiftY: number = 0;

  private lastDropTarget: HTMLElement | null = null;

  constructor(
    private data: Word,
    private actionHandler: (action: WordAction) => void,
    private initRowType: RowType,
  ) {
    const lastWordClassName = data.isLast ? styles.last : "";
    const firstWordClassName = data.correctPosition === 0 ? styles.first : "";
    const classNames = [styles.word, firstWordClassName, lastWordClassName];

    super({
      className: classNames.join(" "),
    });

    this.getElement().style.width = `${data.width}px`;

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
    this.setBackground();
    this.calculateBackgroundPositions();
  }

  setBackground() {
    this.getChildren().forEach((child) => {
      const element = child.getElement();
      element.style.backgroundImage = `url(${IMAGES_BASE_URL}/${this.data.backgroundImage})`;
    });
  }

  private calculateBackgroundPositions() {
    const [content, convex] = this.getChildren();

    const rowOffsetY = this.data.stage * CARD_HEIGHT;
    const contentOffsetX = this.data.offset;
    content.getElement().style.backgroundPosition = `-${contentOffsetX}px -${rowOffsetY}px`;

    // the convex starts at the same place as the next piece
    const convexOffsetX = this.data.offset + this.data.width;
    // align the convex in the middle, the same as  `top: 50%; transformY: -50%`
    const convexOffsetY = rowOffsetY + CARD_HEIGHT / 2 - CONVEX_HEIGHT / 2;
    convex.getElement().style.backgroundPosition = `-${convexOffsetX}px -${convexOffsetY}px`;
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
    // cannot use this.lastDropTarget here, because drop canceling wouldn't work
    const dropTarget = WordCard.findDroppableCell(e.clientX, e.clientY);

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

    if (dropTarget) {
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
