interface ObservableInterface<T> {
    subscribe(observer: (data: T) => void): void;
    unsubscribe(observer: (data: T) => void): void;
    publish(data: T): void;
}

//adapter for windowed-observables
class WindowedObservableAdapter<T> implements ObservableInterface<T> {
    
}

//adapter for rxjs
class RxJSObservableAdapter<T> implements ObservableInterface<T> {
    
}

//factory methods to define targets based on configs
class ObservableFactory {
    static createObservable<T>(type: 'windowed-observables' | 'rxjs'): ObservableInterface<T> {
        switch (type) {
            case 'windowed-observables':
                return new WindowedObservableAdapter<T>();
            case 'rxjs':
                return new RxJSObservableAdapter<T>();
            default:
                throw new Error('Unsupported observable type');
        }
    }
}

//  example:
const observableType = 'windowed-observables'; // or 'rxjs'
const observable = ObservableFactory.createObservable(observableType);
observable.subscribe(data => {
    console.log('Received data:', data);
});
observable.publish('Hello, world!');
