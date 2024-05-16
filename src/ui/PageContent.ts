import Component from "../util/Component";

export default class PageContent extends Component {
  constructor(className: string, ...children: Array<Component>) {
    super({ tag: "main", className }, ...children);
  }
}
