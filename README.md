PubSubObservable
This project implements a pub/sub pattern using observables in TypeScript. It provides a factory for creating observables and adapter classes for different implementations.

Classes
ObservableFactory
The ObservableFactory provides static methods for creating, subscribing, and managing observables.

Methods:

createObservable(data: ObservableData) - Creates an observable instance based on the provided configuration
subscribeAll(instances: ObservableAdapter[], callback: Observer) - Subscribes a callback to multiple observable instances
unsubscribeAll(instances: ObservableAdapter[], callback: Observer) - Unsubscribes a callback from multiple observable instances
clearAll(instances: ObservableAdapter[]) - Clears all events from the given observable instances
WindowedObservableAdapter
The WindowedObservableAdapter implements the observable interface using native browser events and local storage.

Methods:

constructor(namespace: string) - Creates an instance for the given namespace
subscribe(callback: Observer) - Subscribes a callback
unsubscribe(callback: Observer) - Unsubscribes a callback
publish(data: any) - Publishes data to subscribers
getEvents() - Gets all events
getLastEvent() - Gets the last published event
clear() - Clears all events
RxJSObservableAdapter
The RxJSObservableAdapter wraps an RxJS observable to implement the observable interface.

Methods:

Same as WindowedObservableAdapter
Observer
The Observer interface defines the callback for subscribers.

Methods:

next(value: any) - Called when observable publishes data
error(error: any) - Called on error
complete() - Called on completion
Usage
// Create observable 
const observable = ObservableFactory.createObservable({
  name: 'my-observable'
});

// Subscribe
const callback = {
  next: (value) => {
    console.log(value);
  }
};
observable.subscribe(callback);

// Publish
observable.publish('Hello World!'); 

// Unsubscribe
observable.unsubscribe(callback);

// Clear all events
ObservableFactory.clearAll([observable]); 