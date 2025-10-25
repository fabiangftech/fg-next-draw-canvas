import { createHandleNodesReplaced } from '../../src/components/fg-next-draw-canvas/handler/handle-nodes-replaced.handler';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('createHandleNodesReplaced', () => {
  it('should replace nodes correctly', () => {
    // Arrange
    const mockSetNodes = jest.fn();
    const handler = createHandleNodesReplaced(mockSetNodes);
    const newNodes: FgnNodeModel[] = [
      {
        id: 'node-1',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        code: 'A',
        label: 'Node A',
        leftConnectionPoint: { x: 100, y: 100 },
        rightConnectionPoint: { x: 300, y: 100 }
      }
    ];

    // Act
    handler(newNodes);

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(newNodes);
  });

  it('should handle empty nodes array', () => {
    // Arrange
    const mockSetNodes = jest.fn();
    const handler = createHandleNodesReplaced(mockSetNodes);
    const emptyNodes: FgnNodeModel[] = [];

    // Act
    handler(emptyNodes);

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(emptyNodes);
  });
});
