import Component from "../../../shared/Component";
import styles from "./WordCard.module.css";

import rowStyles from "../fields/Row.module.css";

export interface Word {
  text: string;
  width: number;
  readonly correctPosition: number;
  currentPosition: number;
}

export default class WordCard extends Component {
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

  mouseDownHandler(e: MouseEvent) {
    const card = this.getElement();

    card.style.position = "absolute";
    card.style.zIndex = "1000";

    document.body.append(card);

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

  mouseMoveHandler(e: MouseEvent): void {
    this.moveAt(e.pageX, e.pageY);
  }

  mouseUpHandler(e: MouseEvent) {
    const elementsBelow = document.elementsFromPoint(e.clientX, e.clientY);

    const cellEl = elementsBelow.find((element) =>
      element.classList.contains(rowStyles.cell),
    );

    if (!cellEl) {
      // basically, nothing happens, but we need to synchronize the UI with the state because we snapped the card from the row, leaving a gap
      this.dropCallback(this.data.currentPosition, null);
    }

    // TODO: create assertion function
    if (cellEl instanceof HTMLElement) {
      const indexTo = cellEl.dataset.index;
      this.dropCallback(this.data.currentPosition, Number(indexTo));
    }

    // absolutely positioned card always gets destroyed
    this.destroy();
  }

  moveAt(pageX: number, pageY: number): void {
    const card = this.getElement();

    card.style.left = `${pageX - card.offsetWidth / 2}px`;
    card.style.top = `${pageY - card.offsetHeight / 2}px`;
  }
}
