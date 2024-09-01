import Component from "../../../shared/Component";
import Draggable from "../../../shared/Draggable";
import { div, span } from "../../../ui/tags";

import HintSettings from "../model/HintSettings";
import RoundState from "../model/RoundState";
import { Word, MoveCardAction, RowType } from "../types";
import { assertNonNull, IMAGES_BASE_URL } from "../../../shared/helpers";

import styles from "./WordCard.module.css";
import rowStyles from "../fields/Row.module.css";

export default class WordCard extends Draggable {
  private textSpan: Component;

  constructor(
    private data: Word,
    private rowData: { type: RowType; width: number; height: number },
    private roundState: RoundState,
    private hintSettings: HintSettings,
  ) {
    const lastWordClassName = data.isLast ? styles.last : "";
    const firstWordClassName = data.correctPosition === 0 ? styles.first : "";
    const className = [styles.word, firstWordClassName, lastWordClassName].join(
      " ",
    );

    super(className, rowStyles.cell);

    this.textSpan = span({ className: styles.text, text: this.data.text });
    this.configure();
  }

  private configure() {
    const content = div({ className: styles.content }, this.textSpan);
    const convex = div({ className: styles.convex });

    this.appendChildren([content, convex]);
    this.setBackground(this.hintSettings.state.background);
    this.calculateBackgroundPositions(this.rowData.width, this.rowData.height);
  }

  setBackground(isHintEnabled: boolean | null) {
    this.getChildren().forEach((child) => {
      const element = child.getElement();
      element.style.backgroundImage = isHintEnabled
        ? `url(${IMAGES_BASE_URL}/${this.data.image})`
        : "none";
    });
  }

  // The math can be tricky: the width of the card is specified in percentages, but the background-position in percentages behaves differently than when it's set in pixels. It's easier to calculate the actual width of the card in pixels rather than dealing with the current setup.
  // TODO: Change the formula to avoid excessive calculations and to work with percentages. */
  public calculateBackgroundPositions(rowWidth: number, rowHeight: number) {
    const [content, convex] = this.getChildren();

    const rowOffsetY = this.data.stage * rowHeight;
    const contentOffsetX = (rowWidth * this.data.offset) / 100;

    const convexHeight = window.matchMedia("(width<500px)").matches ? 10 : 20;

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

  fadeAwayCardText(transitionDelay: number) {
    this.textSpan.addClass(styles.faded);
    this.textSpan.setInlineStyles({ transitionDelay: `${transitionDelay}s` });
  }

  clickHandler() {
    // clicking always move to the opposite word
    const oppositeRow =
      this.rowData.type === RowType.PICK ? RowType.ASSEMBLE : RowType.PICK;

    const action: MoveCardAction = {
      type: "click/move",
      payload: {
        indexFrom: +assertNonNull(this.getElement().dataset.index),
        rowFrom: this.rowData.type,
        indexTo: -1, // not relevant
        rowTo: oppositeRow,
      },
    };

    this.roundState.moveCard(action);
  }

  // basically, nothing happens, but we need to synchronize the UI with the state because we snapped the card from the row, leaving a gap
  dropCancelHandler(): void {
    const action: MoveCardAction = {
      type: "drop/cancel",
      payload: {
        indexFrom: +assertNonNull(this.getElement().dataset.index),
        rowFrom: this.rowData.type,
        indexTo: +assertNonNull(this.getElement().dataset.index),
        rowTo: this.rowData.type,
      },
    };

    this.roundState.moveCard(action);
  }

  dropSwapHanlder(dropTarget: HTMLElement): void {
    const action: MoveCardAction = {
      type: "drop/swap",
      payload: {
        indexFrom: +assertNonNull(this.getElement().dataset.index),
        rowFrom: this.rowData.type,
        indexTo: +assertNonNull(dropTarget.dataset.index),
        // NOTE: had to use type casting, maybe there is an other way, but doesn't seem like it
        rowTo: assertNonNull(dropTarget.dataset.type as RowType),
      },
    };
    this.roundState.moveCard(action);
  }
}
