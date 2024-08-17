import State from "../../../app/state/StatePublisher";
import data from "../../../../data/words.json";
import { calculateCardWidthPixels } from "../../../shared/helpers";
import { MoveCardAction, Round, Stage, StageStatus, Word } from "../types";

function generateStageWords(stage: Stage, imageSrc: string): Array<Word> {
  const { sentence, stageNumber } = stage;

  let offset = 0;
  return sentence
    .split(" ")
    .map((text, index, arr) => {
      const width = calculateCardWidthPixels(sentence, text);
      const word = {
        text,
        width,
        correctPosition: index,
        isLast: index === arr.length - 1,
        offset,
        stage: stageNumber,
        image: imageSrc,
      };
      offset += width;
      return word;
    })
    .sort(() => Math.random() - 0.5);
}

function prepareRound(): Round {
  const rawData = data.rounds[0].words;
  const { author, name, imageSrc } = data.rounds[0].levelData;

  const stages = rawData.map((entry, index) => ({
    stageNumber: index,
    status: StageStatus.NOT_COMPLETED,
    sentence: entry.textExample,
    sentenceLength: entry.textExample.split(" ").length,
    translation: entry.textExampleTranslate,
    audio: entry.audioExample,
  }));

  return {
    currentStage: 0,
    painting: { author, name, imageSrc },
    stages,
    content: {
      pickArea: [],
      assembleArea: [],
    },
  };
}

export default class RoundState extends State<Round> {
  constructor() {
    super(prepareRound());
  }

  startStage(stageNumber: number): void {
    const { imageSrc } = this.state.painting;

    this.state.currentStage = stageNumber;

    this.state.content.pickArea = generateStageWords(
      this.state.stages[stageNumber],
      imageSrc,
    );

    this.state.content.assembleArea = Array.from(
      { length: this.state.content.pickArea.length },
      () => null,
    );

    this.notifySubscribers();
  }

  startNextStage(): void {
    // handle last stage
    if (this.state.currentStage === this.state.stages.length - 1) return;

    this.startStage(this.state.currentStage + 1);
  }

  startRound(): void {
    this.startStage(0);
  }

  moveCard(action: MoveCardAction): void {
    const { rowTo, rowFrom, indexTo, indexFrom } = action.payload;
    const areaTo = this.state.content[rowTo];
    const areaFrom = this.state.content[rowFrom];

    switch (action.type) {
      case "drop/swap": {
        // swap
        [areaFrom[indexFrom], areaTo[indexTo]] = [
          areaTo[indexTo],
          areaFrom[indexFrom],
        ];
        break;
      }
      case "drop/cancel":
        break;
      case "click/move": {
        // insert in the first empty cell
        const insertPosition = areaTo.indexOf(null);
        areaTo[insertPosition] = areaFrom[indexFrom];
        areaFrom[indexFrom] = null;
        break;
      }
      default:
        break;
    }

    this.setStageStatus(StageStatus.NOT_COMPLETED);

    this.notifySubscribers();
  }

  verifyAnswer(): void {
    const isCorrect = this.state.content.assembleArea.every((word, index) =>
      word ? word.correctPosition === index : false,
    );

    this.setStageStatus(
      isCorrect ? StageStatus.CORRECT : StageStatus.INCORRECT,
    );

    this.notifySubscribers();
  }

  autocompleteStage(): void {
    this.state.content.assembleArea = this.state.content.pickArea
      .concat(this.state.content.assembleArea)
      .filter(Boolean)
      .filter(Boolean)
      .sort((a, b) => (a && b ? a.correctPosition - b.correctPosition : 0));

    this.state.content.pickArea.fill(null);

    this.setStageStatus(StageStatus.AUTOCOMPLETED);

    this.notifySubscribers();
  }

  setStageStatus(updatedStatus: StageStatus): void {
    this.state.stages[this.state.currentStage].status = updatedStatus;
  }

  isStageCompleted(): boolean {
    return [StageStatus.AUTOCOMPLETED, StageStatus.CORRECT].includes(
      this.state.stages[this.state.currentStage].status,
    );
  }

  isAssembled() {
    return this.state.content.assembleArea.every((word) => word);
  }
}
