import { Observer, Events } from "./types";

export interface ObservableInterface<T> {
  subscribeTo(observer: Observer<T>): void; //change in names required
  publishTo(data: T): void; //change in names required
  // To get the last published message/state
  getLastPublishedEvent(): T | undefined;
  // To get the list of published message/state
  getListOfEvents(): Events<T>;
  unsubscribeTo(observer: Observer<T>): void;
  clearObservable(): void;
}
