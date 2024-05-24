import { Publisher, Observer } from "../../shared/Observer";

export default class State<T> implements Publisher {
  public state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

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
}
