import { useEffect, useCallback, useRef } from 'react';
import { EventListener } from './event-bus.types';
import { globalEventBus, EventBus } from './event-bus';

/**
 * Custom React hook to interact with the EventBus
 * @param eventBus - Optional EventBus instance, defaults to globalEventBus
 */
export const useEventBus = (eventBus: EventBus = globalEventBus) => {
  const eventBusRef = useRef(eventBus);

  useEffect(() => {
    eventBusRef.current = eventBus;
  }, [eventBus]);

  /**
   * Subscribe to an event
   * The subscription will be automatically cleaned up when component unmounts
   */
  const on = useCallback(<T>(eventName: string, listener: EventListener<T>) => {
    return eventBusRef.current.on(eventName, listener);
  }, []);

  /**
   * Unsubscribe from an event
   */
  const off = useCallback(<T>(eventName: string, listener: EventListener<T>) => {
    eventBusRef.current.off(eventName, listener);
  }, []);

  /**
   * Emit an event with data
   */
  const emit = useCallback(<T>(eventName: string, data: T) => {
    eventBusRef.current.emit(eventName, data);
  }, []);

  /**
   * Clear listeners
   */
  const clear = useCallback((eventName?: string) => {
    eventBusRef.current.clear(eventName);
  }, []);

  return { on, off, emit, clear };
};

/**
 * Custom React hook to listen to a specific event
 * Automatically handles subscription and cleanup
 * @param eventName - The name of the event to listen to
 * @param listener - The callback function to execute when event is emitted
 * @param eventBus - Optional EventBus instance, defaults to globalEventBus
 */
export const useEventListener = <T>(
  eventName: string,
  listener: EventListener<T>,
  eventBus: EventBus = globalEventBus
) => {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const wrappedListener = (data: T) => listenerRef.current(data);
    const subscription = eventBus.on<T>(eventName, wrappedListener);

    return () => {
      subscription.unsubscribe();
    };
  }, [eventName, eventBus]);
};

