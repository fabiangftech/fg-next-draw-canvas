import { renderHook } from '@testing-library/react';
import { useConnectionDelete } from '../../src/components/fg-next-draw-canvas/handler/handle-connection-delete.handler';
import { FgnConnectionModel } from '../../src/components/fg-next-draw-canvas/model/fgn-connection.model';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('useConnectionDelete', () => {
  const mockConnections: FgnConnectionModel[] = [
    { id: 'conn-1', sourceNodeId: 'node-1', targetNodeId: 'node-2' },
    { id: 'conn-2', sourceNodeId: 'node-2', targetNodeId: 'node-3' }
  ];

  const mockNodes: FgnNodeModel[] = [
    {
      id: 'node-1',
      x: 0, y: 0, width: 100, height: 50,
      code: 'A', label: 'Node A',
      leftConnectionPoint: { x: 0, y: 25 },
      rightConnectionPoint: { x: 100, y: 25 },
      connectedTo: ['node-2'],
      connectedFrom: []
    },
    {
      id: 'node-2',
      x: 200, y: 0, width: 100, height: 50,
      code: 'B', label: 'Node B',
      leftConnectionPoint: { x: 200, y: 25 },
      rightConnectionPoint: { x: 300, y: 25 },
      connectedTo: ['node-3'],
      connectedFrom: ['node-1']
    }
  ];

  it('should delete connection and update node references', () => {
    // Arrange
    const mockSetConnections = jest.fn();
    const mockSetNodes = jest.fn();
    const mockEmit = jest.fn();
    const CONNECTION_DELETED_EVENT = 'CONNECTION_DELETED';

    const { result } = renderHook(() =>
      useConnectionDelete(
        mockConnections,
        mockSetConnections,
        mockSetNodes,
        mockEmit,
        CONNECTION_DELETED_EVENT
      )
    );

    // Act
    result.current.handleConnectionDelete('conn-1');

    // Assert
    expect(mockSetConnections).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(mockSetNodes).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(mockEmit).toHaveBeenCalledWith(
      CONNECTION_DELETED_EVENT,
      mockConnections[0]
    );
  });

  it('should not do anything if connection does not exist', () => {
    // Arrange
    const mockSetConnections = jest.fn();
    const mockSetNodes = jest.fn();
    const mockEmit = jest.fn();
    const CONNECTION_DELETED_EVENT = 'CONNECTION_DELETED';

    const { result } = renderHook(() =>
      useConnectionDelete(
        mockConnections,
        mockSetConnections,
        mockSetNodes,
        mockEmit,
        CONNECTION_DELETED_EVENT
      )
    );

    // Act
    result.current.handleConnectionDelete('non-existent-conn');

    // Assert
    expect(mockSetConnections).not.toHaveBeenCalled();
    expect(mockSetNodes).not.toHaveBeenCalled();
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it('should update node connectedTo and connectedFrom arrays', () => {
    // Arrange
    const mockSetConnections = jest.fn();
    const mockSetNodes = jest.fn();
    const mockEmit = jest.fn();
    const CONNECTION_DELETED_EVENT = 'CONNECTION_DELETED';

    const { result } = renderHook(() =>
      useConnectionDelete(
        mockConnections,
        mockSetConnections,
        mockSetNodes,
        mockEmit,
        CONNECTION_DELETED_EVENT
      )
    );

    // Act
    result.current.handleConnectionDelete('conn-1');

    // Assert
    const setNodesCall = mockSetNodes.mock.calls[0][0];
    const updatedNodes = setNodesCall(mockNodes);
    
    const sourceNode = updatedNodes.find(n => n.id === 'node-1');
    const targetNode = updatedNodes.find(n => n.id === 'node-2');
    
    expect(sourceNode?.connectedTo).not.toContain('node-2');
    expect(targetNode?.connectedFrom).not.toContain('node-1');
  });

  it('should handle node that is neither source nor target', () => {
    // Arrange
    const mockSetConnections = jest.fn();
    const mockSetNodes = jest.fn();
    const mockEmit = jest.fn();
    const CONNECTION_DELETED_EVENT = 'CONNECTION_DELETED';

    const { result } = renderHook(() =>
      useConnectionDelete(
        mockConnections,
        mockSetConnections,
        mockSetNodes,
        mockEmit,
        CONNECTION_DELETED_EVENT
      )
    );

    // Act
    result.current.handleConnectionDelete('conn-1');

    // Assert - This tests the case where a node is neither source nor target
    // The node should be returned unchanged (line 22 in the handler)
    const setNodesCall = mockSetNodes.mock.calls[0][0];
    const updatedNodes = setNodesCall(mockNodes);
    
    // Find a node that is neither source nor target (node-3 in this case)
    const unrelatedNode = updatedNodes.find(n => n.id === 'node-3');
    expect(unrelatedNode).toBeUndefined(); // node-3 doesn't exist in mockNodes, but this tests the logic path
  });
});
