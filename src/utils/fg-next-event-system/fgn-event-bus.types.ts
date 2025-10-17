/**
 * Type definition for event listener callback
 * @template T - The type of data the event will carry
 */
export type FgnEventListener<T = any> = (data: T) => void;

/**
 * Interface for event subscription
 */
export interface FgnEventSubscription {
  unsubscribe: () => void;
}

/**
 * Interface for the EventBus
 */
export interface IFgnEventBus {
  on<T>(eventName: string, listener: FgnEventListener<T>): FgnEventSubscription;
  off<T>(eventName: string, listener: FgnEventListener<T>): void;
  emit<T>(eventName: string, data: T): void;
  clear(eventName?: string): void;
}
