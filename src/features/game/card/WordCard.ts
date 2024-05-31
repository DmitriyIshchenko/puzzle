import Component from "../../../shared/Component";
import styles from "./WordCard.module.css";

import rowStyles from "../fields/Row.module.css";

export interface Word {
  text: string;
  width: number;
  readonly correctPosition: number;
  currentPosition: number;
}

const DRAG_THRESHOLD = 5;

export default class WordCard extends Component {
  private clientX: number = 0;

  private clientY: number = 0;

  constructor(
    private data: Word,
    private dropCallback: (from: number, to: number | null) => void,
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
    // else this.clickHandler(e);

    // absolutely positioned card always gets destroyed
    this.destroy();
  }

  // private clickHandler(e: MouseEvent) {
  //   console.log("click");
  // }

  private dropHandler(e: MouseEvent) {
    const { currentPosition } = this.data;

    // find the target cell underneath the dragged card
    const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);
    const dropTarget = elementsBelow.find((element) =>
      element.classList.contains(rowStyles.cell),
    );

    if (!dropTarget) {
      // basically, nothing happens, but we need to synchronize the UI with the state because we snapped the card from the row, leaving a gap
      this.dropCallback(currentPosition, null);
    }

    // TODO: create assertion function
    if (dropTarget instanceof HTMLElement) {
      const indexTo = dropTarget.dataset.index;
      this.dropCallback(currentPosition, Number(indexTo));
    }
  }

  private moveAt(pageX: number, pageY: number): void {
    const card = this.getElement();

    card.style.left = `${pageX - card.offsetWidth / 2}px`;
    card.style.top = `${pageY - card.offsetHeight / 2}px`;
  }
}
