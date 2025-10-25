import { renderHook, act } from '@testing-library/react';
import { useFgnEventBus, useFgnEventListener } from '../../../src/utils/fg-next-event-system/fgn-use-event-bus.hook';
import { FgnEventBus } from '../../../src/utils/fg-next-event-system/fgn-event-bus';

// Mock the event bus
jest.mock('../../../src/utils/fg-next-event-system/fgn-event-bus', () => {
  const mockUnsubscribe = jest.fn();
  const mockOn = jest.fn(() => ({ unsubscribe: mockUnsubscribe }));
  const mockOff = jest.fn();
  const mockEmit = jest.fn();
  const mockClear = jest.fn();

  const mockEventBus = {
    on: mockOn,
    off: mockOff,
    emit: mockEmit,
    clear: mockClear
  };

  return {
    fgnGlobalEventBus: mockEventBus,
    FgnEventBus: {} as FgnEventBus
  };
});

describe('useFgnEventBus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide on, off, emit, and clear methods', () => {
    // Act
    const { result } = renderHook(() => useFgnEventBus());

    // Assert
    expect(result.current.on).toBeDefined();
    expect(result.current.off).toBeDefined();
    expect(result.current.emit).toBeDefined();
    expect(result.current.clear).toBeDefined();
  });

  it('should call on method on event bus', () => {
    // Arrange
    const listener = jest.fn();
    const { result } = renderHook(() => useFgnEventBus());

    // Act
    act(() => {
      result.current.on('test-event', listener);
    });

    // Assert
    const { fgnGlobalEventBus } = require('../../../src/utils/fg-next-event-system/fgn-event-bus');
    expect(fgnGlobalEventBus.on).toHaveBeenCalledWith('test-event', listener);
  });

  it('should call off method on event bus', () => {
    // Arrange
    const listener = jest.fn();
    const { result } = renderHook(() => useFgnEventBus());

    // Act
    act(() => {
      result.current.off('test-event', listener);
    });

    // Assert
    const { fgnGlobalEventBus } = require('../../../src/utils/fg-next-event-system/fgn-event-bus');
    expect(fgnGlobalEventBus.off).toHaveBeenCalledWith('test-event', listener);
  });

  it('should call emit method on event bus', () => {
    // Arrange
    const testData = { id: '123', name: 'Test' };
    const { result } = renderHook(() => useFgnEventBus());

    // Act
    act(() => {
      result.current.emit('test-event', testData);
    });

    // Assert
    const { fgnGlobalEventBus } = require('../../../src/utils/fg-next-event-system/fgn-event-bus');
    expect(fgnGlobalEventBus.emit).toHaveBeenCalledWith('test-event', testData);
  });

  it('should call clear method on event bus', () => {
    // Arrange
    const { result } = renderHook(() => useFgnEventBus());

    // Act
    act(() => {
      result.current.clear('test-event');
    });

    // Assert
    const { fgnGlobalEventBus } = require('../../../src/utils/fg-next-event-system/fgn-event-bus');
    expect(fgnGlobalEventBus.clear).toHaveBeenCalledWith('test-event');
  });

  it('should call clear method without event name', () => {
    // Arrange
    const { result } = renderHook(() => useFgnEventBus());

    // Act
    act(() => {
      result.current.clear();
    });

    // Assert
    const { fgnGlobalEventBus } = require('../../../src/utils/fg-next-event-system/fgn-event-bus');
    expect(fgnGlobalEventBus.clear).toHaveBeenCalledWith(undefined);
  });

  it('should use custom event bus when provided', () => {
    // Arrange
    const customEventBus = {
      on: jest.fn(() => ({ unsubscribe: jest.fn() })),
      off: jest.fn(),
      emit: jest.fn(),
      clear: jest.fn()
    };
    const listener = jest.fn();
    const { result } = renderHook(() => useFgnEventBus(customEventBus));

    // Act
    act(() => {
      result.current.on('test-event', listener);
    });

    // Assert
    expect(customEventBus.on).toHaveBeenCalledWith('test-event', listener);
  });
});

describe('useFgnEventListener', () => {
  const { fgnGlobalEventBus } = require('../../../src/utils/fg-next-event-system/fgn-event-bus');
  let mockUnsubscribe: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUnsubscribe = jest.fn();
    (fgnGlobalEventBus.on as jest.Mock).mockReturnValue({ unsubscribe: mockUnsubscribe });
  });

  it('should subscribe to event on mount', () => {
    // Arrange
    const listener = jest.fn();

    // Act
    renderHook(() => useFgnEventListener('test-event', listener));

    // Assert
    expect(fgnGlobalEventBus.on).toHaveBeenCalledWith('test-event', expect.any(Function));
  });

  it('should call listener when event is emitted', () => {
    // Arrange
    const listener = jest.fn();

    // Act
    renderHook(() => useFgnEventListener('test-event', listener));

    // Get the wrapped listener
    const wrappedListener = (fgnGlobalEventBus.on as jest.Mock).mock.calls[0][1];
    const testData = { id: '123' };
    wrappedListener(testData);

    // Assert
    expect(listener).toHaveBeenCalledWith(testData);
  });

  it('should unsubscribe on unmount', () => {
    // Arrange
    const listener = jest.fn();

    // Act
    const { unmount } = renderHook(() => useFgnEventListener('test-event', listener));
    unmount();

    // Assert
    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should update listener reference when listener changes', () => {
    // Arrange
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    // Act
    const { rerender } = renderHook(
      ({ listener }) => useFgnEventListener('test-event', listener),
      { initialProps: { listener: listener1 } }
    );
    rerender({ listener: listener2 });

    // Get the wrapped listener
    const wrappedListener = (fgnGlobalEventBus.on as jest.Mock).mock.calls[0][1];
    const testData = { id: '123' };
    wrappedListener(testData);

    // Assert
    expect(listener2).toHaveBeenCalledWith(testData);
    expect(listener1).not.toHaveBeenCalled();
  });

  it('should resubscribe when event name changes', () => {
    // Arrange
    const listener = jest.fn();

    // Act
    const { rerender } = renderHook(
      ({ eventName }) => useFgnEventListener(eventName, listener),
      { initialProps: { eventName: 'event-1' } }
    );
    rerender({ eventName: 'event-2' });

    // Assert
    expect(fgnGlobalEventBus.on).toHaveBeenCalledWith('event-1', expect.any(Function));
    expect(fgnGlobalEventBus.on).toHaveBeenCalledWith('event-2', expect.any(Function));
  });

  it('should use custom event bus when provided', () => {
    // Arrange
    const customEventBus = {
      on: jest.fn(() => ({ unsubscribe: jest.fn() })),
      off: jest.fn(),
      emit: jest.fn(),
      clear: jest.fn()
    };
    const listener = jest.fn();

    // Act
    renderHook(() => useFgnEventListener('test-event', listener, customEventBus));

    // Assert
    expect(customEventBus.on).toHaveBeenCalledWith('test-event', expect.any(Function));
  });
});
