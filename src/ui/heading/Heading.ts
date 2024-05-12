import BaseComponent from "../../components/BaseComponent";

import styles from "./Heading.module.css";

export enum HeadingTag {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
}

export default class Heading extends BaseComponent {
  constructor(tag: HeadingTag, text: string) {
    super({
      tag,
      className: styles[`heading-${tag.slice(1)}`],
      text,
    });
  }
}
