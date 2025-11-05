import { FgnEventListener, FgnEventSubscription, IFgnEventBus } from './fgn-event-bus.types';

/**
 * Simple EventBus implementation following the Observer pattern
 * Allows components to communicate without direct dependencies
 */
interface BufferingConfig {
  enabled: boolean;
  maxSize: number;
}

export class FgnEventBus implements IFgnEventBus {
  private readonly listeners: Map<string, Set<FgnEventListener>>;
  private readonly eventBuffers: Map<string, unknown[]>;
  private readonly bufferingConfig: Map<string, BufferingConfig>;

  constructor() {
    this.listeners = new Map();
    this.eventBuffers = new Map();
    this.bufferingConfig = new Map();
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

    // Replay buffered events if this is the first listener for this event
    if (eventListeners.size === 1 && this.eventBuffers.has(eventName)) {
      const bufferedEvents = this.eventBuffers.get(eventName)!;
      for (const bufferedData of bufferedEvents) {
        try {
          listener(bufferedData as T);
        } catch (error) {
          console.error(`Error replaying buffered event for "${eventName}":`, error);
        }
      }
      // Clear buffer after replaying
      this.eventBuffers.delete(eventName);
    }

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
    if (eventListeners && eventListeners.size > 0) {
      // Use for...of instead of forEach as per linter
      const listenersArray = Array.from(eventListeners);
      for (const listener of listenersArray) {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for "${eventName}":`, error);
        }
      }
    } else {
      // No listeners, check if buffering is enabled
      const config = this.bufferingConfig.get(eventName);
      if (config && config.enabled) {
        this.bufferEvent(eventName, data, config.maxSize);
      }
    }
  }

  /**
   * Buffer an event when no listeners are available
   * @param eventName - The name of the event
   * @param data - The data to buffer
   * @param maxSize - Maximum buffer size
   */
  private bufferEvent<T>(eventName: string, data: T, maxSize: number): void {
    if (!this.eventBuffers.has(eventName)) {
      this.eventBuffers.set(eventName, []);
    }

    const buffer = this.eventBuffers.get(eventName)!;
    
    // For maxSize = 1, replace the buffer with just the latest event
    if (maxSize === 1) {
      this.eventBuffers.set(eventName, [data]);
    } else {
      buffer.push(data);
      // Trim buffer if it exceeds maxSize
      if (buffer.length > maxSize) {
        buffer.shift();
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

  /**
   * Enable buffering for a specific event
   * @param eventName - The name of the event to buffer
   * @param maxBufferSize - Maximum number of events to buffer (default: 1 for replacement events)
   */
  enableBuffering(eventName: string, maxBufferSize: number = 1): void {
    this.bufferingConfig.set(eventName, {
      enabled: true,
      maxSize: maxBufferSize
    });
  }

  /**
   * Disable buffering for a specific event
   * @param eventName - The name of the event to stop buffering
   */
  disableBuffering(eventName: string): void {
    const config = this.bufferingConfig.get(eventName);
    if (config) {
      config.enabled = false;
    }
    // Clear buffer when disabling
    this.eventBuffers.delete(eventName);
  }

  /**
   * Clear buffered events for a specific event or all events
   * @param eventName - Optional event name to clear, if not provided clears all buffers
   */
  clearBuffer(eventName?: string): void {
    if (eventName) {
      this.eventBuffers.delete(eventName);
    } else {
      this.eventBuffers.clear();
    }
  }
}

// Singleton instance for global event bus
export const fgnGlobalEventBus = new FgnEventBus();

// Enable buffering for critical events that are typically emitted before listeners are ready
// These are replacement events where only the latest value matters
fgnGlobalEventBus.enableBuffering('nodes:replaced', 1);
fgnGlobalEventBus.enableBuffering('connections:replaced', 1);
