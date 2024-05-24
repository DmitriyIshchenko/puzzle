import Component from "../../../shared/Component";
import styles from "./WordCard.module.css";

export interface Word {
  text: string;
  width: number;
  correctPosition: number;
  currentPosition: number;
}

export default class WordCard extends Component {
  constructor(data: Word) {
    super({
      className: styles.word,
      text: data.text,
    });
  }
}
