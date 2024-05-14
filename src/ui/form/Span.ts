import BaseComponent from "../../util/BaseComponent";

export default class Span extends BaseComponent<HTMLSpanElement> {
  constructor(className: string, text: string) {
    super({
      tag: "span",
      className,
      text,
    });
  }
}
