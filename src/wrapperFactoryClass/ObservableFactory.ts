import { WindowedObservableAdapter } from "./WrapperWindowedObservable";
import { ObservableData, Observer } from "../types";

//factory methods to define targets based on configs
export class ObservableFactory {
  static createObservable<T>(data: ObservableData) {
    // switch (data.type) {
    //   case 'windowed-observables':
    //     return new WindowedObservableAdapter<T>(data.name);
    //   case 'rxjs':
    //     return new RxJSObservableAdapter<T>();
    //   default:
    //     return new WindowedObservableAdapter<T>(data.name);
    // }
    return data.name.map(
      (namespace) => new WindowedObservableAdapter(namespace)
    );
  }
  static subscribeAll<T>(
    instances: WindowedObservableAdapter<T>[],
    callback: Observer<T>
  ) {
    instances.forEach((instance) => {
      instance.subscribeTo(callback);
    });
  }

  static unsubscribeAll<T>(
    instances: WindowedObservableAdapter<T>[],
    callback: Observer<T>
  ) {
    instances.forEach((instance) => {
      instance.unsubscribeTo(callback);
    });
  }
  static clearAll<T>(instances: WindowedObservableAdapter<T>[]) {
    instances.forEach((instance) => {
      instance.clearObservable();
    });
  }
}
