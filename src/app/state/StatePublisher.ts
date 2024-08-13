import { Publisher, Observer } from "../../shared/Observer";

export default class State<T> implements Publisher {
  public state: T;

  constructor(
    private defaultState: T,
    private key: string = "",
  ) {
    this.state = this.loadState();
  }

  private subscribers: Array<Observer> = [];

  private loadState() {
    const stateString = localStorage.getItem(this.key);

    if (stateString) return JSON.parse(stateString) as T;

    return this.defaultState;
  }

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
