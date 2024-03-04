import { WindowedObservable } from "./WIndowed-Observable";
import { ObservableInterface } from "../interface";
import { Events, Observer } from "../types";

//adapter for windowed-observables
export class WindowedObservableAdapter<T>
  extends WindowedObservable
  implements ObservableInterface<T>
{
  constructor(namespace: string) {
    super(namespace);
  }
  subscribeTo(observer: Observer<T>): void {
    this.subscribe(observer);
  }
  publishTo(data: T): void {
    this.publish(data);
  }
  getLastPublishedEvent(): T | undefined {
    return this.getLastEvent();
  }
  getListOfEvents(): Events<T> {
    return this.getEvents();
  }
  unsubscribeTo(observer: Observer<T>): void {
    this.unsubscribe(observer);
  }
  clearObservable(): void {
    this.clear();
  }
}
