import Component from "../../../shared/Component";
import Modal from "../../../ui/modal/Modal";
import ArtworkMiniature from "./ArtworkMiniature";
import SentencesList, { SentencesListType } from "./SentencesList";
import Button from "../../../ui/button/Button";
import { div } from "../../../ui/tags";

import RoundState from "../model/RoundState";
import { Observer, Publisher } from "../../../shared/Observer";
import { Stage, StageStatus } from "../types";

import styles from "./RoundStats.module.css";

export default class RoundStats extends Component implements Observer {
  private artwork: ArtworkMiniature;

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
    this.knownSentencesList = new SentencesList(SentencesListType.SOLVED);
    this.unknownSentencesList = new SentencesList(SentencesListType.UNSOLVED);

    this.appendChildren([
      this.artwork,
      div(
        { className: styles.sentences },
        this.knownSentencesList,
        this.unknownSentencesList,
      ),
      continueButton,
    ]);
  }

  update(publisher: Publisher): void {
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

      this.modal.updateContent(this);
    }
  }
}
