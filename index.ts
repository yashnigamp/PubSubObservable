interface ObservableInterface<T> {
  subscribeTo(observer: Observer<T>): void; //change in names required
  publishTo(data: T): void; //change in names required
  // To get the last published message/state
  getLastPublishedEvent(): T | undefined;
  // To get the list of published message/state
  getListOfEvents(): Events<T>;
  unsubscribeTo(observer: Observer<T>): void;
  clearObservable(): void;
}
export const EVENTS = '__events__';
export const SHARED = '__shared__';
export const OBSERVERS = '__observers__';
export type Events<T = any> = T[];

export type ObserverOptions<T = any> = {
  events: T[];
  lastEvent?: T;
};

export type Observer<T = any> = (
  data: T | undefined,
  options: ObserverOptions
) => void;

export type Observers<T = any> = Observer<T>[];

declare global {
  interface Window {
    __shared__: {
      __events__: Record<string, Events>;
      __observers__: Record<string, Observers>;
    };
  }
}
export type ObservableData = {
  name: [string, ...string[]];
  type?: 'windowed-observables' | 'rxjs';
};
//adapter for windowed-observables

class WindowedObservable<T = any> {
  private _namespace!: string;
  private _sharedWindow: Window;

  constructor(namespace: string) {
    try {
      this._sharedWindow = WindowedObservable.getSharedWindow();
      this.initialize();
    } catch (error) {
      console.error('Error initializing shared window:', error);
      // Handle error appropriately
    }
    this.namespace = namespace;
  }

  private static getSharedWindow(): Window {
    if (typeof window !== 'undefined' && window.top) {
      return window.top;
    } else {
      throw new Error('Unable to access top-level window.');
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

    this.observers.forEach(observer => observer(data, { events, lastEvent }));

    this.events.push(data);
  }

  dispatch = this.publish;

  subscribe(observer: Observer<T>): void {
    this.observers = this.observers.concat(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  clear(): void {
    const events = this.events;
    const lastEvent = this.getLastEvent();

    this.observers.forEach(observer =>
      observer(undefined, { events, lastEvent })
    );

    this.events = [];
    this.observers = [];
  }
}

class WindowedObservableAdapter<T> extends WindowedObservable
  implements ObservableInterface<T> {
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

//adapter for rxjs
// class RxJSObservableAdapter<T> extends RxJS implements ObservableInterface<T>{}

//factory methods to define targets based on configs
class ObservableFactory {
  static createObservable<T>(data: ObservableData) {
    // switch (data.type) {
    //   case 'windowed-observables':
    //     return new WindowedObservableAdapter<T>(data.name);
    //   case 'rxjs':
    //     return new RxJSObservableAdapter<T>();
    //   default:
    //     return new WindowedObservableAdapter<T>(data.name);
    // }
    return data.name.map(namespace => new WindowedObservableAdapter(namespace));
  }
  static subscribeAll<T>(
    instances: WindowedObservableAdapter<T>[],
    callback: Observer<T>
  ) {
    instances.forEach(instance => {
      instance.subscribeTo(callback);
    });
  }

  static unsubscribeAll<T>(
    instances: WindowedObservableAdapter<T>[],
    callback: Observer<T>
  ) {
    instances.forEach(instance => {
      instance.unsubscribeTo(callback);
    });
  }
  static clearAll<T>(instances: WindowedObservableAdapter<T>[]) {
    instances.forEach(instance => {
      instance.clearObservable();
    });
  }
}

// //  example:
// const observableType = "windowed-observables"; // or 'rxjs'
const observable = ObservableFactory.createObservable({ name: ['Yash'] });
console.log(observable);
