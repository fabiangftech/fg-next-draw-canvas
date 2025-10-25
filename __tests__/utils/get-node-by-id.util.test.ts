import { getNodeById } from '../../src/utils/get-node-by-id.util';
import { fgnGlobalEventBus } from '../../src/utils/fg-next-event-system/fgn-event-bus';
import { CANVAS_EVENTS } from '../../src/components/fg-next-draw-canvas/model/canvas-events.constants';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

// Mock the global event bus
jest.mock('../../src/utils/fg-next-event-system/fgn-event-bus', () => ({
  fgnGlobalEventBus: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  }
}));

describe('getNodeById', () => {
  const mockEventBus = fgnGlobalEventBus as jest.Mocked<typeof fgnGlobalEventBus>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should emit request and resolve with node when found', async () => {
    // Arrange
    const nodeId = 'test-node-id';
    const mockNode: FgnNodeModel = {
      id: nodeId,
      x: 100,
      y: 50,
      width: 200,
      height: 100,
      code: 'A',
      label: 'Test Node'
    };

    let responseHandler: (response: any) => void;
    mockEventBus.on.mockImplementation((eventName, handler) => {
      if (eventName === CANVAS_EVENTS.GET_NODE_BY_ID_RESPONSE) {
        responseHandler = handler;
      }
      return { unsubscribe: jest.fn() };
    });

    // Act
    const promise = getNodeById(nodeId);
    
    // Simulate response
    const requestId = mockEventBus.emit.mock.calls[0][1].requestId;
    responseHandler({ node: mockNode, requestId });

    const result = await promise;

    // Assert
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      CANVAS_EVENTS.GET_NODE_BY_ID_REQUEST,
      expect.objectContaining({ id: nodeId })
    );
    expect(result).toEqual(mockNode);
  });

  it('should resolve with null when node not found', async () => {
    // Arrange
    const nodeId = 'non-existent-id';

    let responseHandler: (response: any) => void;
    mockEventBus.on.mockImplementation((eventName, handler) => {
      if (eventName === CANVAS_EVENTS.GET_NODE_BY_ID_RESPONSE) {
        responseHandler = handler;
      }
      return { unsubscribe: jest.fn() };
    });

    // Act
    const promise = getNodeById(nodeId);
    
    // Simulate response
    const requestId = mockEventBus.emit.mock.calls[0][1].requestId;
    responseHandler({ node: null, requestId });

    const result = await promise;

    // Assert
    expect(result).toBeNull();
  });

  it('should timeout after 5 seconds', async () => {
    // Arrange
    const nodeId = 'test-id';

    // Act
    const promise = getNodeById(nodeId);
    
    // Fast-forward time
    jest.advanceTimersByTime(5000);

    // Assert
    await expect(promise).rejects.toThrow('Timeout: No response received for getNodeById request');
  });

  it('should ignore responses with different request ID', async () => {
    // Arrange
    const nodeId = 'test-id';
    const mockNode: FgnNodeModel = {
      id: nodeId,
      x: 100,
      y: 50,
      width: 200,
      height: 100,
      code: 'A',
      label: 'Test Node'
    };

    let responseHandler: (response: any) => void;
    mockEventBus.on.mockImplementation((eventName, handler) => {
      if (eventName === CANVAS_EVENTS.GET_NODE_BY_ID_RESPONSE) {
        responseHandler = handler;
      }
      return { unsubscribe: jest.fn() };
    });

    // Act
    const promise = getNodeById(nodeId);
    
    // Simulate response with wrong request ID
    responseHandler({ node: mockNode, requestId: 'wrong-request-id' });

    // Fast-forward to timeout
    jest.advanceTimersByTime(5000);

    // Assert
    await expect(promise).rejects.toThrow('Timeout: No response received for getNodeById request');
  });
});
