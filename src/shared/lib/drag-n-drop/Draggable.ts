import Component from "../../ui/base/Component";

const DRAG_THRESHOLD = 10;

export default abstract class Draggable extends Component {
  private clientX: number = 0;

  private clientY: number = 0;

  private shiftX: number = 0;

  private shiftY: number = 0;

  private lastDropTarget: HTMLElement | null = null;

  constructor(
    className: string,
    private droppableClassName: string,
  ) {
    super({
      className,
    });

    this.getElement().addEventListener(
      "mousedown",
      this.mouseDownHandler.bind(this),
    );
  }

  abstract dropCancelHandler(): void;

  abstract dropSwapHandler(dropTarget: HTMLElement): void;

  abstract clickHandler(): void;

  private mouseDownHandler(e: MouseEvent): void {
    // track coordinates to tell apart clicks from drags
    this.clientX = e.clientX;
    this.clientY = e.clientY;

    const element = this.getElement();
    const { left, top, height, width } = element.getBoundingClientRect();

    // keep track of these coordinates to adjust the dragging point to any location on the element. otherwise, the center of the element will move to the cursor when clicked.
    this.shiftX = e.clientX - left;
    this.shiftY = e.clientY - top;

    // snap the element from the row
    const elementStyles = {
      position: "absolute",
      zIndex: "1000",
      cursor: "grabbing",
      height: `${height}px`,
      width: `${width}px`,
    };

    this.setInlineStyles(elementStyles);
    document.body.append(element);

    // follow the cursor
    this.moveAt(e.pageX, e.pageY);
    const mouseMoveBound = this.mouseMoveHandler.bind(this);
    window.addEventListener("mousemove", mouseMoveBound);

    // adding an event listener this way is justified here, since we need exactly one 'mouseup' listener, which will be removed after triggering
    element.onmouseup = (event: MouseEvent) => {
      this.mouseUpHandler(event);

      // stops dragging
      window.removeEventListener("mousemove", mouseMoveBound);

      // deletes itself
      element.onmouseup = null;
    };
  }

  private mouseMoveHandler(e: MouseEvent): void {
    this.moveAt(e.pageX, e.pageY);

    const dropTarget = this.findDroppable(e.clientX, e.clientY);

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

  private dropHandler(e: MouseEvent) {
    // cannot use this.lastDropTarget here, because drop canceling wouldn't work
    const dropTarget = this.findDroppable(e.clientX, e.clientY);

    if (!dropTarget) {
      this.dropCancelHandler();
    }

    if (dropTarget) {
      this.dropSwapHandler(dropTarget);
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
  private findDroppable(clientX: number, clientY: number): HTMLElement | null {
    // find the target cell underneath the dragged card
    const elementsBelow = document.elementsFromPoint(clientX, clientY);
    const dropTarget = elementsBelow.find((element) =>
      element.classList.contains(this.droppableClassName),
    );

    return dropTarget instanceof HTMLElement ? dropTarget : null;
  }
}
