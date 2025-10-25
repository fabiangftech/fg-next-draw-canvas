import { FgnEventBus } from '../../../src/utils/fg-next-event-system/fgn-event-bus';

describe('FgnEventBus', () => {
  let eventBus: FgnEventBus;

  beforeEach(() => {
    eventBus = new FgnEventBus();
  });

  describe('on and emit', () => {
    it('should register and call event listener', () => {
      // Arrange
      const eventName = 'test-event';
      const mockListener = jest.fn();
      const testData = { message: 'test' };

      // Act
      eventBus.on(eventName, mockListener);
      eventBus.emit(eventName, testData);

      // Assert
      expect(mockListener).toHaveBeenCalledWith(testData);
    });

    it('should call multiple listeners for same event', () => {
      // Arrange
      const eventName = 'test-event';
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const testData = { message: 'test' };

      // Act
      eventBus.on(eventName, listener1);
      eventBus.on(eventName, listener2);
      eventBus.emit(eventName, testData);

      // Assert
      expect(listener1).toHaveBeenCalledWith(testData);
      expect(listener2).toHaveBeenCalledWith(testData);
    });

    it('should not call listeners for different events', () => {
      // Arrange
      const listener = jest.fn();

      // Act
      eventBus.on('event1', listener);
      eventBus.emit('event2', {});

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove specific listener', () => {
      // Arrange
      const eventName = 'test-event';
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      // Act
      eventBus.on(eventName, listener1);
      eventBus.on(eventName, listener2);
      eventBus.off(eventName, listener1);
      eventBus.emit(eventName, {});

      // Assert
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should clean up empty event listeners', () => {
      // Arrange
      const eventName = 'test-event';
      const listener = jest.fn();

      // Act
      eventBus.on(eventName, listener);
      eventBus.off(eventName, listener);

      // Assert
      expect(eventBus.hasListeners(eventName)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all listeners for specific event', () => {
      // Arrange
      const listener = jest.fn();

      // Act
      eventBus.on('event1', listener);
      eventBus.on('event2', listener);
      eventBus.clear('event1');
      eventBus.emit('event1', {});
      eventBus.emit('event2', {});

      // Assert
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should clear all listeners when no event specified', () => {
      // Arrange
      const listener = jest.fn();

      // Act
      eventBus.on('event1', listener);
      eventBus.on('event2', listener);
      eventBus.clear();
      eventBus.emit('event1', {});
      eventBus.emit('event2', {});

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('hasListeners and getListenerCount', () => {
    it('should return false for non-existent event', () => {
      // Assert
      expect(eventBus.hasListeners('non-existent')).toBe(false);
      expect(eventBus.getListenerCount('non-existent')).toBe(0);
    });

    it('should return correct count for existing listeners', () => {
      // Arrange
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      // Act
      eventBus.on('test', listener1);
      eventBus.on('test', listener2);

      // Assert
      expect(eventBus.hasListeners('test')).toBe(true);
      expect(eventBus.getListenerCount('test')).toBe(2);
    });
  });

  describe('error handling', () => {
    it('should handle listener errors gracefully', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorListener = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      const normalListener = jest.fn();

      // Act
      eventBus.on('test', errorListener);
      eventBus.on('test', normalListener);
      eventBus.emit('test', {});

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error in event listener for "test":',
        expect.any(Error)
      );
      expect(normalListener).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
