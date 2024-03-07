import { EVENTS, OBSERVERS, SHARED } from "../constant";
import { Events, Observer, Observers } from "../types";

export class WindowedObservable<T = any> {
  private _namespace!: string;
  private _sharedWindow: Window = window;

  constructor(namespace: string) {
    try {
      this._sharedWindow = WindowedObservable.getSharedWindow();
      this.initialize();
    } catch (error) {
      console.error("Error initializing shared window:", error);
      // Handle error appropriately
    }
    this.namespace = namespace;
  }

  private static getSharedWindow(): Window {
    if (typeof window !== "undefined" && window.top) {
      return window.top;
    } else {
      throw new Error("Unable to access top-level window.");
    }
  }
  // istanbul ignore next
  private initialize() {
    if (!this._sharedWindow[SHARED]) {
      this._sharedWindow[SHARED] = {
        [EVENTS]: {},
        [OBSERVERS]: {},
      };
    }

    if (!this._sharedWindow[SHARED][EVENTS]) {
      this._sharedWindow[SHARED][EVENTS] = {};
    }

    if (!this._sharedWindow[SHARED][OBSERVERS]) {
      this._sharedWindow[SHARED][OBSERVERS] = {};
    }
  }

  set namespace(namespace: string) {
    this._namespace = namespace;

    // istanbul ignore next
    if (!this.events) this.events = [];

    // istanbul ignore next
    if (!this.observers) this.observers = [];
  }

  private get events(): Events<T> {
    return this._sharedWindow[SHARED][EVENTS][this._namespace];
  }

  private set events(newEvents: Events<T>) {
    this._sharedWindow[SHARED][EVENTS][this._namespace] = newEvents;
  }

  private get observers(): Observers<T> {
    return this._sharedWindow[SHARED][OBSERVERS][this._namespace];
  }

  private set observers(newObservers: Observers<T>) {
    this._sharedWindow[SHARED][OBSERVERS][this._namespace] = newObservers;
  }

  getEvents(): Events<T> {
    return this.events;
  }

  getLastEvent(): T | undefined {
    const events = this.events;
    if (!events.length) {
      return;
    }

    const lastEvent = events[events.length - 1];

    return lastEvent;
  }

  publish(data: T): void {
    const events = this.events;
    const lastEvent = this.getLastEvent();

    this.observers.forEach((observer) => observer(data, { events, lastEvent }));

    this.events.push(data);
  }

  dispatch = this.publish;

  subscribe(observer: Observer<T>): void {
    this.observers = this.observers.concat(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  clear(): void {
    const events = this.events;
    const lastEvent = this.getLastEvent();

    this.observers.forEach((observer) =>
      observer(undefined, { events, lastEvent })
    );

    this.events = [];
    this.observers = [];
  }
}
