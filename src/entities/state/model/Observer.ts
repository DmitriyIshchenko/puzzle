export interface Publisher {
  subscribe(subscriber: Observer): void;

  unsubscribe(subscriber: Observer): void;

  notifySubscribers(): void;
}

export interface Observer {
  update(state: Publisher): void;
}
