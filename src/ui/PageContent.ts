import BaseComponent from "../util/BaseComponent";

export default class PageContent extends BaseComponent {
  constructor(className: string, ...children: Array<BaseComponent>) {
    super({ tag: "main", className }, ...children);
  }
}
