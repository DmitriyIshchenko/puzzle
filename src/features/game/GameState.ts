import words from "../../../data/words.json";
import { Observer, Publisher } from "../../shared/Observer";
import { splitSentence } from "../../shared/helpers";

interface GameData {
  sentence: string;
  rowContent: Array<string>;
  pickAreaContent: Array<string>;
}

export default class GameState implements Publisher {
  // temporary hardcoded
  public state: GameData = {
    sentence: words.rounds[0].words[0].textExample,
    rowContent: [],
    pickAreaContent: splitSentence(words.rounds[0].words[0].textExample),
  };

  private subscribers: Array<Observer> = [];

  subscribe(subscriber: Observer): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Observer): void {
    const targetIndex = this.subscribers.indexOf(subscriber);

    this.subscribers.splice(targetIndex, 1);
  }

  notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.update(this);
    });
  }

  pickWord(word: string) {
    const index = this.state.pickAreaContent.indexOf(word);
    this.state.pickAreaContent.splice(index, 1);

    this.state.rowContent.push(word);

    this.notifySubscribers();
  }

  discardWord(word: string) {
    const index = this.state.rowContent.indexOf(word);
    this.state.rowContent.splice(index, 1);

    this.state.pickAreaContent.push(word);

    this.notifySubscribers();
  }

  startGame() {
    this.notifySubscribers();
  }
}
