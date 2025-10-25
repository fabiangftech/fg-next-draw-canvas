import { createHandleConnectionsReplaced } from '../../src/components/fg-next-draw-canvas/handler/handle-connections-replaced.handler';
import { FgnConnectionModel } from '../../src/components/fg-next-draw-canvas/model/fgn-connection.model';

describe('createHandleConnectionsReplaced', () => {
  it('should replace connections correctly', () => {
    // Arrange
    const mockSetConnections = jest.fn();
    const handler = createHandleConnectionsReplaced(mockSetConnections);
    const newConnections: FgnConnectionModel[] = [
      { id: 'conn-1', sourceNodeId: 'node-1', targetNodeId: 'node-2' },
      { id: 'conn-2', sourceNodeId: 'node-2', targetNodeId: 'node-3' }
    ];

    // Act
    handler(newConnections);

    // Assert
    expect(mockSetConnections).toHaveBeenCalledWith(newConnections);
  });

  it('should handle empty connections array', () => {
    // Arrange
    const mockSetConnections = jest.fn();
    const handler = createHandleConnectionsReplaced(mockSetConnections);
    const emptyConnections: FgnConnectionModel[] = [];

    // Act
    handler(emptyConnections);

    // Assert
    expect(mockSetConnections).toHaveBeenCalledWith(emptyConnections);
  });
});
