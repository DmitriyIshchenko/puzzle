import { Component, p } from "../../../shared";
import { Observer, Publisher } from "../../../entities/state";
import { Painting } from "../../../entities/painting";
import { RoundState } from "../../../features/levels";

import styles from "./PaintingInfo.module.css";

export class PaintingInfo extends Component implements Observer {
  constructor(private roundState: RoundState) {
    super(
      {
        tag: "div",
        className: styles.info,
      },
      p({ className: styles.name }),
      p({ className: styles.author }),
      p({ className: styles.year }),
    );

    this.roundState.subscribe(this);
  }

  update(publisher: Publisher) {
    if (publisher instanceof RoundState) {
      const isRoundCompleted = publisher.isRoundCompleted();
      this.updateContent(publisher.state.painting, isRoundCompleted);
      this.toggleVisibility(isRoundCompleted);
    }
  }

  private updateContent(painting: Painting, isRoundCompleted: boolean) {
    const paragraphs = this.getChildren();
    const { name, author, year } = painting;

    [name, author, year].forEach((value, index) => {
      paragraphs[index].setTextContent(isRoundCompleted ? value : "");
    });
  }

  private toggleVisibility(isDisplayed: boolean) {
    if (isDisplayed) {
      this.addClass(styles.appeared);
    } else this.removeClass(styles.appeared);
  }
}
