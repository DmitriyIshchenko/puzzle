import Component from "../../shared/Component";

import styles from "./WordCard.module.css";

interface WordCardData {
  text: string;
  width: number;
}

export default class WordCard extends Component {
  constructor(data: WordCardData) {
    super({
      className: styles.word,
      text: data.text,
    });

    this.getElement().style.width = `${data.width.toString()}%`;
  }
}
