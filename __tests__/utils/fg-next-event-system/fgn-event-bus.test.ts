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
    it('should unsubscribe using returned subscription', () => {
      // Arrange
      const eventName = 'test-event';
      const listener = jest.fn();

      // Act
      const subscription = eventBus.on(eventName, listener);
      subscription.unsubscribe();
      eventBus.emit(eventName, {});

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });

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

  describe('buffering', () => {
    it('should replay buffered events when first listener subscribes', () => {
      // Arrange
      const listener = jest.fn();
      const eventName = 'buffered-event';
      eventBus.enableBuffering(eventName, 3);

      // Act
      eventBus.emit(eventName, 'first');
      eventBus.emit(eventName, 'second');
      eventBus.emit(eventName, 'third');
      eventBus.on(eventName, listener);

      // Assert
      expect(listener).toHaveBeenNthCalledWith(1, 'first');
      expect(listener).toHaveBeenNthCalledWith(2, 'second');
      expect(listener).toHaveBeenNthCalledWith(3, 'third');
    });

    it('should handle errors while replaying buffered events', () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const eventName = 'buffered-error';
      const errorListener = jest.fn(() => {
        throw new Error('Replay error');
      });

      eventBus.enableBuffering(eventName, 2);
      eventBus.emit(eventName, 'payload');

      // Act
      eventBus.on(eventName, errorListener);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error replaying buffered event for "buffered-error":',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should only keep latest event when max buffer size is one', () => {
      // Arrange
      const listener = jest.fn();
      const eventName = 'single-buffer';
      eventBus.enableBuffering(eventName, 1);

      // Act
      eventBus.emit(eventName, 'old');
      eventBus.emit(eventName, 'new');
      eventBus.on(eventName, listener);

      // Assert
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('new');
    });

    it('should trim oldest buffered events when exceeding max size', () => {
      // Arrange
      const listener = jest.fn();
      const eventName = 'trim-buffer';
      eventBus.enableBuffering(eventName, 2);

      // Act
      eventBus.emit(eventName, 'first');
      eventBus.emit(eventName, 'second');
      eventBus.emit(eventName, 'third');
      eventBus.on(eventName, listener);

      // Assert
      expect(listener).toHaveBeenNthCalledWith(1, 'second');
      expect(listener).toHaveBeenNthCalledWith(2, 'third');
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should respect disableBuffering and clear buffered events', () => {
      // Arrange
      const listener = jest.fn();
      const eventName = 'disabled-buffer';
      eventBus.enableBuffering(eventName, 2);
      eventBus.emit(eventName, 'before-disable');

      // Act
      eventBus.disableBuffering(eventName);
      eventBus.emit(eventName, 'after-disable');
      eventBus.on(eventName, listener);

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });

    it('should clear buffer without affecting listeners', () => {
      // Arrange
      const listener = jest.fn();
      const eventName = 'clear-buffer';
      eventBus.enableBuffering(eventName, 2);
      eventBus.emit(eventName, 'stale');
      eventBus.clearBuffer(eventName);

      // Act
      eventBus.on(eventName, listener);
      eventBus.emit(eventName, 'fresh');

      // Assert
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('fresh');
    });

    it('should clear all buffers when no event is specified', () => {
      // Arrange
      const listener = jest.fn();
      const eventName = 'clear-all';
      eventBus.enableBuffering(eventName, 2);
      eventBus.emit(eventName, 'stale');

      // Act
      eventBus.clearBuffer();
      eventBus.on(eventName, listener);

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
