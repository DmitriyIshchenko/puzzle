import BaseComponent from "../util/BaseComponent";

export default class PageContent extends BaseComponent<HTMLElement> {
  constructor(
    className: string,
    ...children: Array<BaseComponent<HTMLElement>>
  ) {
    super({ tag: "main", className }, ...children);
  }
}
