interface ObservableInterface<T> {
  subscribe(observer: (data: T) => void): void; //change in names required
  unsubscribe(observer: (data: T) => void): void; //change in names required
  publish(data: T): void;//change in names required
    // TO subscribe to multiple topics 
    // To clear all the topics state/messages 
    // To publish same message/state to multiple topics
    // To get the last published message/state
    // To get the list of published message/state
    // 
}
export const EVENTS = "__events__";
export const SHARED = "__shared__";
export const OBSERVERS = "__observers__";
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
//adapter for windowed-observables

class WindowedObservableAdapter<T> implements ObservableInterface<T> {
    private _namespace: string;
    private _sharedWindow: Window;

    constructor(namespace: string) {
        this._namespace = namespace;
        this._sharedWindow = WindowedObservableAdapter.getSharedWindow();
        this.initialize();
    }

    private static getSharedWindow(): Window {
        if (typeof window !== 'undefined' && window.top) {
            return window.top;
        } else {
            throw new Error('Unable to access top-level window.');
        }
    }

    private initialize() {
        if (!this._sharedWindow[SHARED]) {
            this._sharedWindow[SHARED] = {
                [EVENTS]: {},
                [OBSERVERS]: {},
            };
        }

        if (!this._sharedWindow[SHARED][EVENTS][this._namespace]) {
            this._sharedWindow[SHARED][EVENTS][this._namespace] = [];
        }

        if (!this._sharedWindow[SHARED][OBSERVERS][this._namespace]) {
            this._sharedWindow[SHARED][OBSERVERS][this._namespace] = [];
        }
    }

    subscribe(observer: (data: T) => void): void {
        this._sharedWindow[SHARED][OBSERVERS][this._namespace].push(observer);
    }

    unsubscribe(observer: (data: T) => void): void {
        this._sharedWindow[SHARED][OBSERVERS][this._namespace] = this._sharedWindow[SHARED][OBSERVERS][this._namespace]
            .filter(obs => obs !== observer);
    }

    publish(data: T): void {
        const observers = this._sharedWindow[SHARED][OBSERVERS][this._namespace];
        const events = this._sharedWindow[SHARED][EVENTS][this._namespace];
        observers.forEach(observer => observer(data));
        events.push(data);
    }

    // Add other methods as needed
}


//adapter for rxjs
class RxJSObservableAdapter<T> implements ObservableInterface<T> {
    
}

//factory methods to define targets based on configs
class ObservableFactory {
  static createObservable<T>(
    type: "windowed-observables" | "rxjs"
  ): ObservableInterface<T> {
    switch (type) {
      case "windowed-observables":
        return new WindowedObservableAdapter<T>();
      case "rxjs":
        return new RxJSObservableAdapter<T>();
      default:
        throw new Error("Unsupported observable type");
    }
  }
}

//  example:
const observableType = "windowed-observables"; // or 'rxjs'
const observable = ObservableFactory.createObservable(observableType);
observable.subscribe((data) => {
  console.log("Received data:", data);
});
observable.publish("Hello, world!");
