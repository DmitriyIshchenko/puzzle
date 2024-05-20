import Component from "../../../shared/Component";
import { RowStatus } from "../model/GameState";

import styles from "./WordCard.module.css";

interface WordCardData {
  text: string;
  width: number;
  status?: RowStatus;
}

export default class WordCard extends Component {
  constructor(data: WordCardData) {
    super({
      className: `${styles.word} ${data.status === RowStatus.CORRECT ? styles.correct : ""}`,
      text: data.text,
    });

    this.getElement().style.width = `${data.width.toString()}%`;
  }
}
