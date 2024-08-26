import Component, { ElementFuncProps } from "../shared/Component";

export const div = (
  props: ElementFuncProps<HTMLDivElement>,
  ...children: Array<Component>
) => new Component<HTMLDivElement>(props, ...children);

export const main = (props: ElementFuncProps, ...children: Array<Component>) =>
  new Component({ ...props, tag: "main" }, ...children);

export const label = (
  props: ElementFuncProps<HTMLLabelElement>,
  ...children: Array<Component>
) => new Component<HTMLLabelElement>({ ...props, tag: "label" }, ...children);

export const input = (props: ElementFuncProps<HTMLInputElement>) =>
  new Component<HTMLInputElement>({ ...props, tag: "input" });

export const a = (
  props: ElementFuncProps<HTMLLinkElement>,
  ...children: Array<Component>
) => new Component({ ...props, tag: "a" }, ...children);

// make src and alt required
export const img = (
  props: ElementFuncProps<HTMLImageElement> &
    Required<Pick<HTMLImageElement, "src" | "alt">>,
) => new Component<HTMLImageElement>({ ...props, tag: "img" });

export const span = (props: ElementFuncProps<HTMLSpanElement>) =>
  new Component<HTMLSpanElement>({ ...props, tag: "span" });

export const p = (
  props: ElementFuncProps<HTMLParagraphElement>,
  ...children: Array<Component>
) => new Component<HTMLParagraphElement>({ ...props, tag: "p" }, ...children);

export const ul = (
  props: ElementFuncProps<HTMLUListElement>,
  ...children: Array<Component>
) => new Component<HTMLUListElement>({ ...props, tag: "ul" }, ...children);

export const li = (
  props: ElementFuncProps<HTMLLIElement>,
  ...children: Array<Component>
) => new Component<HTMLLIElement>({ ...props, tag: "li" }, ...children);

// I could write a function to create a specific heading element, but I think it's fine as it is.
// To me calling h1(props) looks more convenient than h(1, props), or even just h(props) with configurable level of heading
export const h1 = (
  props: ElementFuncProps<HTMLHeadingElement>,
  ...children: Array<Component>
) => new Component<HTMLHeadingElement>({ ...props, tag: "h1" }, ...children);

export const h2 = (
  props: ElementFuncProps<HTMLHeadingElement>,
  ...children: Array<Component>
) => new Component<HTMLHeadingElement>({ ...props, tag: "h2" }, ...children);

export const h3 = (
  props: ElementFuncProps<HTMLHeadingElement>,
  ...children: Array<Component>
) => new Component<HTMLHeadingElement>({ ...props, tag: "h3" }, ...children);

export const i = (props: ElementFuncProps) =>
  new Component<HTMLElement>({ ...props, tag: "i" });

export const select = (
  props: ElementFuncProps<HTMLSelectElement>,
  ...children: Array<Component>
) => new Component<HTMLSelectElement>({ ...props, tag: "select" }, ...children);

export const option = (
  props: ElementFuncProps<HTMLOptionElement>,
  ...children: Array<Component>
) => new Component<HTMLOptionElement>({ ...props, tag: "option" }, ...children);
