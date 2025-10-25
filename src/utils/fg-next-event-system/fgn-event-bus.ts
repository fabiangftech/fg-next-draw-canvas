import { FgnEventListener, FgnEventSubscription, IFgnEventBus } from './fgn-event-bus.types';

/**
 * Simple EventBus implementation following the Observer pattern
 * Allows components to communicate without direct dependencies
 */
export class FgnEventBus implements IFgnEventBus {
  private readonly listeners: Map<string, Set<FgnEventListener>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param eventName - The name of the event to listen to
   * @param listener - The callback function to execute when event is emitted
   * @returns EventSubscription object with unsubscribe method
   */
  on<T>(eventName: string, listener: FgnEventListener<T>): FgnEventSubscription {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }

    const eventListeners = this.listeners.get(eventName)!;
    eventListeners.add(listener as FgnEventListener);

    return {
      unsubscribe: () => this.off(eventName, listener),
    };
  }

  /**
   * Unsubscribe from an event
   * @param eventName - The name of the event
   * @param listener - The callback function to remove
   */
  off<T>(eventName: string, listener: FgnEventListener<T>): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.delete(listener as FgnEventListener);
      
      if (eventListeners.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Emit an event with data
   * @param eventName - The name of the event to emit
   * @param data - The data to pass to all listeners
   */
  emit<T>(eventName: string, data: T): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      // Use for...of instead of forEach as per linter
      const listenersArray = Array.from(eventListeners);
      for (const listener of listenersArray) {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for "${eventName}":`, error);
        }
      }
    }
  }

  /**
   * Clear all listeners for a specific event or all events
   * @param eventName - Optional event name to clear, if not provided clears all
   */
  clear(eventName?: string): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Check if an event has any listeners
   * @param eventName - The name of the event to check
   * @returns true if the event has listeners
   */
  hasListeners(eventName: string): boolean {
    const eventListeners = this.listeners.get(eventName);
    return eventListeners ? eventListeners.size > 0 : false;
  }

  /**
   * Get the number of listeners for a specific event
   * @param eventName - The name of the event
   * @returns The count of listeners
   */
  getListenerCount(eventName: string): number {
    const eventListeners = this.listeners.get(eventName);
    return eventListeners ? eventListeners.size : 0;
  }
}

// Singleton instance for global event bus
export const fgnGlobalEventBus = new FgnEventBus();
