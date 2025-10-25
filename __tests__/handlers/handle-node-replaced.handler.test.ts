import { createHandleNodeReplaced } from '../../src/components/fg-next-draw-canvas/handler/handle-node-replaced.handler';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('createHandleNodeReplaced', () => {
  const mockNodes: FgnNodeModel[] = [
    {
      id: 'node-1',
      x: 0, y: 0, width: 100, height: 50,
      code: 'A', label: 'Node A',
      leftConnectionPoint: { x: 0, y: 25 },
      rightConnectionPoint: { x: 100, y: 25 }
    },
    {
      id: 'node-2',
      x: 200, y: 0, width: 100, height: 50,
      code: 'B', label: 'Node B',
      leftConnectionPoint: { x: 200, y: 25 },
      rightConnectionPoint: { x: 300, y: 25 }
    }
  ];

  it('should replace existing node', () => {
    // Arrange
    const mockSetNodes = jest.fn();
    const handler = createHandleNodeReplaced(mockSetNodes);
    const updatedNode: FgnNodeModel = {
      id: 'node-1',
      x: 50, y: 50, width: 150, height: 75,
      code: 'A', label: 'Updated Node A',
      leftConnectionPoint: { x: 50, y: 87.5 },
      rightConnectionPoint: { x: 200, y: 87.5 }
    };

    // Act
    handler(updatedNode);

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Function));
    
    const setNodesCall = mockSetNodes.mock.calls[0][0];
    const result = setNodesCall(mockNodes);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(updatedNode);
    expect(result[1]).toEqual(mockNodes[1]);
  });

  it('should add new node if not found', () => {
    // Arrange
    const mockSetNodes = jest.fn();
    const handler = createHandleNodeReplaced(mockSetNodes);
    const newNode: FgnNodeModel = {
      id: 'node-3',
      x: 400, y: 0, width: 100, height: 50,
      code: 'C', label: 'Node C',
      leftConnectionPoint: { x: 400, y: 25 },
      rightConnectionPoint: { x: 500, y: 25 }
    };

    // Act
    handler(newNode);

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Function));
    
    const setNodesCall = mockSetNodes.mock.calls[0][0];
    const result = setNodesCall(mockNodes);
    
    expect(result).toHaveLength(3);
    expect(result[2]).toEqual(newNode);
  });

  it('should maintain order when replacing node', () => {
    // Arrange
    const mockSetNodes = jest.fn();
    const handler = createHandleNodeReplaced(mockSetNodes);
    const updatedNode: FgnNodeModel = {
      id: 'node-2',
      x: 250, y: 100, width: 120, height: 60,
      code: 'B', label: 'Updated Node B',
      leftConnectionPoint: { x: 250, y: 130 },
      rightConnectionPoint: { x: 370, y: 130 }
    };

    // Act
    handler(updatedNode);

    // Assert
    const setNodesCall = mockSetNodes.mock.calls[0][0];
    const result = setNodesCall(mockNodes);
    
    expect(result[0]).toEqual(mockNodes[0]); // First node unchanged
    expect(result[1]).toEqual(updatedNode); // Second node replaced
  });
});
