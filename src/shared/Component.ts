// takes all HTML element attributes you can set up and add optional props
export type Props<T extends HTMLElement = HTMLElement> = Partial<T> & {
  tag?: keyof HTMLElementTagNameMap;
  text?: string;
};

// basically the same, but without tag, which will be passed directly to base component constructor
// use it in functions that create simple html components like button or h1
export type ElementFuncProps<T extends HTMLElement = HTMLElement> = Omit<
  Props<T>,
  "tag"
>;

export default class Component<T extends HTMLElement = HTMLElement> {
  protected element: T;

  private children: Array<Component> = [];

  constructor(props: Props<T>, ...children: Array<Component>) {
    // create div by default
    const element = document.createElement(props.tag || "div") as T;

    // effectively sets the properties of the HTML element
    Object.assign(element, props);

    // save element
    this.element = element;

    if (props.text) {
      this.setTextContent(props.text);
    }

    if (children.length !== 0) {
      this.appendChildren(children);
    }
  }

  getElement() {
    return this.element;
  }

  append(child: Component) {
    this.children.push(child);
    this.element.append(child.getElement());
  }

  appendChildren(children: Array<Component>) {
    children.forEach((child) => {
      this.append(child);
    });
  }

  setTextContent(text: string) {
    this.element.textContent = text;
  }

  setAttribute(name: string, value: string = "") {
    this.element.setAttribute(name, value);
  }

  removeAttribute(name: string) {
    this.element.removeAttribute(name);
  }

  toggleAttribute(name: string, condition: boolean) {
    if (condition) {
      this.setAttribute(name);
    } else this.removeAttribute(name);
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

  destroy() {
    this.clear();

    this.element.remove();
  }

  getChildren() {
    return this.children;
  }

  addClass(classNames: string) {
    classNames.split(" ").forEach((className) => {
      this.element.classList.add(className);
    });
  }

  removeClass(className: string) {
    this.element.classList.remove(className);
  }

  resetClasses(newClassName?: string) {
    this.element.className = "";

    if (newClassName) {
      this.addClass(newClassName);
    }
  }

  setInlineStyles(styles: Record<string, string>): void {
    Object.assign(this.element.style, styles);
  }
}
