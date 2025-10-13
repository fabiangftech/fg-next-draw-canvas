/**
 * Type definition for event listener callback
 * @template T - The type of data the event will carry
 */
export type EventListener<T = any> = (data: T) => void;

/**
 * Interface for event subscription
 */
export interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Interface for the EventBus
 */
export interface IEventBus {
  on<T>(eventName: string, listener: EventListener<T>): EventSubscription;
  off<T>(eventName: string, listener: EventListener<T>): void;
  emit<T>(eventName: string, data: T): void;
  clear(eventName?: string): void;
}

