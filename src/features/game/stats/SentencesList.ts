import Component from "../../../shared/Component";
import { h3, li, p, span, ul } from "../../../ui/tags";
import { Stage } from "../types";

import styles from "./SentencesList.module.css";

export enum SentencesListType {
  SOLVED,
  UNSOLVED,
}

export default class SentencesList extends Component {
  private list: Component<HTMLUListElement>;

  private count: Component<HTMLSpanElement>;

  constructor(type: SentencesListType) {
    super({
      tag: "div",
    });

    this.list = ul({ className: styles.list });
    this.count = span({
      className: `${styles.count} ${type === SentencesListType.SOLVED ? styles.solvedCount : styles.unsolvedCount}`,
    });

    const title = h3(
      {
        className: styles.title,
        text: type === SentencesListType.SOLVED ? "I know" : "I don't know",
      },
      this.count,
    );

    this.appendChildren([title, this.list]);
  }

  fillList(stages: Array<Stage>) {
    this.list.clear();

    const listItems = stages.map((stage) =>
      li({}, p({ text: stage.sentence })),
    );

    this.count.setTextContent(listItems.length.toString());
    this.list.appendChildren(listItems);
  }
}
