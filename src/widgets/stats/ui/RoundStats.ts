import { Component, Button, Modal, div, i } from "../../../shared";
import { ArtworkMiniature } from "../../../entities/painting";
import { SentencesList, SentencesListType } from "./SentencesList";

import { RoundState, Stage } from "../../../features/levels";
import { Observer, Publisher } from "../../../entities/state";
import { StageStatus } from "../../../features/levels/model/Stage";

import styles from "./RoundStats.module.css";

export class RoundStats extends Component implements Observer {
  private artwork: ArtworkMiniature;

  private rating: Component;

  private knownSentencesList: SentencesList;

  private unknownSentencesList: SentencesList;

  constructor(
    private roundState: RoundState,
    private modal: Modal,
  ) {
    super({ tag: "div", className: styles.stats });

    this.roundState.subscribe(this);

    const continueButton = new Button(
      "Continue",
      this.roundState.startNextStage.bind(this.roundState),
      styles.continue,
    );

    this.artwork = new ArtworkMiniature(this.roundState.state.painting);
    this.rating = div({ className: styles.rating });
    this.knownSentencesList = new SentencesList(SentencesListType.SOLVED);
    this.unknownSentencesList = new SentencesList(SentencesListType.UNSOLVED);

    this.appendChildren([
      this.artwork,
      this.rating,
      div(
        { className: styles.sentences },
        this.knownSentencesList,
        this.unknownSentencesList,
      ),
      continueButton,
    ]);
  }

  update(publisher: Publisher): void {
    // if (publisher instanceof RoundState) {
    if (publisher instanceof RoundState && publisher.isRoundCompleted()) {
      const solvedStages: Array<Stage> = [];
      const unsolvedStages: Array<Stage> = [];

      publisher.state.stages.forEach((stage) => {
        if (stage.status === StageStatus.CORRECT) solvedStages.push(stage);
        else unsolvedStages.push(stage);
      });

      this.artwork.updateContent(publisher.state.painting);
      this.knownSentencesList.fillList(solvedStages);
      this.unknownSentencesList.fillList(unsolvedStages);
      this.updateRating();

      this.modal.updateContent(this);
    }
  }

  updateRating() {
    const MAX_RATING = 3;
    const { rating } = this.roundState.state.results;

    const emptyStars = Array.from({ length: MAX_RATING - rating }, () =>
      i({ className: "bi bi-star" }),
    );

    const filledStars = Array.from(
      { length: MAX_RATING - emptyStars.length },
      () => i({ className: "bi bi-star-fill" }),
    );

    this.rating.clear();
    this.rating.appendChildren(filledStars.concat(emptyStars));
  }
}
