import { Publisher, Observer } from "./Observer";

export class State<T> implements Publisher {
  public state: T;

  constructor(
    private defaultState: T,
    protected key: string = "",
  ) {
    this.state = this.loadState();
  }

  private subscribers: Array<Observer> = [];

  protected loadState() {
    const stateString = localStorage.getItem(this.key);

    if (stateString) return JSON.parse(stateString) as T;

    return this.defaultState;
  }

  saveState(state = this.state) {
    if (this.key) {
      localStorage.setItem(this.key, JSON.stringify(state));
    }
  }

  subscribe(subscriber: Observer): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Observer): void {
    this.subscribers = this.subscribers.filter((item) => item !== subscriber);
  }

  notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => {
      subscriber.update(this);
    });
  }
}
