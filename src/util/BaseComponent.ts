interface ComponentParams {
  tag: string;
  className: string;
  text?: string;
}

export default abstract class BaseComponent<T extends HTMLElement> {
  protected element: T;

  private children: Array<BaseComponent<HTMLElement>> = [];

  constructor(params: ComponentParams, ...children: Array<BaseComponent<T>>) {
    const { tag = "", text = "", className = "" } = params;

    const element = document.createElement(tag) as T;
    element.className = className;
    element.textContent = text;

    this.element = element;

    if (children.length !== 0) {
      this.appendChildren(children);
    }
  }

  getElement() {
    return this.element;
  }

  append(child: BaseComponent<HTMLElement>) {
    this.children.push(child);
    this.element.append(child.getElement());
  }

  appendChildren(children: Array<BaseComponent<HTMLElement>>) {
    children.forEach((child) => {
      this.append(child);
    });
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

  getChildren() {
    return this.children;
  }

  addClass(className: string) {
    this.element.classList.add(className);
  }

  removeClass(className: string) {
    this.element.classList.remove(className);
  }
}
