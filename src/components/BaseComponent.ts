interface ComponentParams {
  tag: string;
  className: string;
  text?: string;
}

export default abstract class BaseComponent {
  private element: HTMLElement;

  private children: Array<BaseComponent> = [];

  constructor(params: ComponentParams, ...children: Array<BaseComponent>) {
    const { tag = "", text = "", className = "" } = params;

    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;

    this.element = element;

    if (children) {
      this.appendChildren(children);
    }
  }

  getElement() {
    return this.element;
  }

  append(child: BaseComponent) {
    this.children.push(child);
    this.element.append(child.getElement());
  }

  appendChildren(children: Array<BaseComponent>) {
    children.forEach((child) => this.append(child));
  }

  setTextContent(text: string) {
    this.element.textContent = text;
  }

  setAttribute(name: string, value: string) {
    this.element.setAttribute(name, value);
  }

  removeAttribute(name: string) {
    this.element.removeAttribute(name);
  }

  addListener(
    eventType: string,
    listener: EventListener,
    options: boolean | EventListenerOptions = false,
  ) {
    this.element.addEventListener(eventType, listener, options);
  }

  removeListener(
    eventType: string,
    listener: EventListener,
    options: boolean | EventListenerOptions = false,
  ) {
    this.element.removeEventListener(eventType, listener, options);
  }

  clear() {
    while (this.element.firstElementChild) {
      this.element.firstElementChild.remove();
    }
    this.children.length = 0;
  }
}
