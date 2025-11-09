import { createHandleDrop } from '../../src/components/fg-next-draw-canvas/handler/handle-drop.handler';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';
import { NodeFactoryFunction } from '../../src/components/fg-next-node/model/fgn-node-factory.model';

// Mock dependencies
jest.mock('../../src/utils/generate-node-id.util', () => ({
  generateNodeId: jest.fn(() => 'generated-id-123')
}));

jest.mock('../../src/utils/calculate-connection-points.util', () => ({
  calculateConnectionPoints: jest.fn(() => ({
    left: { x: 0, y: 25 },
    right: { x: 150, y: 25 }
  }))
}));

describe('createHandleDrop', () => {
  const mockNodes: FgnNodeModel[] = [];
  const mockSetNodes = jest.fn();
  const mockSvgRef = {
    current: {
      getBoundingClientRect: jest.fn(() => ({
        left: 0,
        top: 0
      }))
    }
  } as React.RefObject<SVGSVGElement>;
  const mockEmit = jest.fn();
  const NODE_ADDED_EVENT = 'NODE_ADDED';
  const defaultNodeSize = { width: 150, height: 75 };
  const mockFactoryFunction: NodeFactoryFunction = jest.fn((data) => ({
    code: data.code,
    status: 'default',
    ...data
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create node at correct position', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      mockSvgRef,
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 }
      }
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn((key: string) => {
          const data: Record<string, string> = {
            'nodeLabel': 'Test Node',
            'nodeIconCode': 'T',
            'nodeColor': '#FF0000'
          };
          return data[key] || '';
        })
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Array));
    expect(mockEmit).toHaveBeenCalledWith(NODE_ADDED_EVENT, expect.any(Object));
  });

  it('should apply zoom and pan offset correctly', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      mockSvgRef,
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 2, // zoomLevel
        panOffset: { x: 10, y: 20 } // panOffset
      }
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn((key: string) => {
          const data: Record<string, string> = {
            'nodeLabel': 'Test Node',
            'nodeIconCode': 'T',
            'nodeColor': '#FF0000'
          };
          return data[key] || '';
        })
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Array));
    const newNode = mockSetNodes.mock.calls[0][0][0];

    // Position should be adjusted for zoom and pan
    expect(newNode.x).toBeCloseTo(-30); // (100 - 0 - 10) / 2 - 75
    expect(newNode.y).toBeCloseTo(-22.5); // (50 - 0 - 20) / 2 - 37.5
  });

  it('should use factory function to get node defaults', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      mockSvgRef,
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 }
      }
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn((key: string) => {
          const data: Record<string, string> = {
            'nodeLabel': 'Test Node',
            'nodeIconCode': 'T',
            'nodeColor': '#FF0000'
          };
          return data[key] || '';
        })
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(mockFactoryFunction).toHaveBeenCalledWith({
      code: 'T',
      status: 'default'
    });
  });

  it('should handle itemData JSON correctly', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      mockSvgRef,
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 }
      }
    );

    const itemData = { customProperty: 'test' };
    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn((key: string) => {
          const data: Record<string, string> = {
            'nodeLabel': 'Test Node',
            'nodeIconCode': 'T',
            'nodeColor': '#FF0000',
            'itemData': JSON.stringify(itemData)
          };
          return data[key] || '';
        })
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(mockFactoryFunction).toHaveBeenCalledWith({
      code: 'T',
      status: 'default',
      ...itemData
    });
  });

  it('should not create node if no nodeLabel', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      mockSvgRef,
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 }
      }
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn(() => '')
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(mockSetNodes).not.toHaveBeenCalled();
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it('should not create node when svgRef is not available', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      { current: null },
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 }
      }
    );

    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn((key: string) => {
          const data: Record<string, string> = {
            'nodeLabel': 'Test Node',
            'nodeIconCode': 'T',
            'nodeColor': '#FF0000'
          };
          return data[key] || '';
        })
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(mockSetNodes).not.toHaveBeenCalled();
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it('should handle drop with invalid itemData JSON', () => {
    // Arrange
    const handler = createHandleDrop(
      mockNodes,
      mockSetNodes,
      mockSvgRef,
      mockEmit,
      NODE_ADDED_EVENT,
      {
        defaultNodeSize,
        getNodeDefaults: mockFactoryFunction,
        defaultStatus: 'default',
        zoomLevel: 1,
        panOffset: { x: 0, y: 0 }
      }
    );

    // Mock console.error to verify it's called
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        getData: jest.fn((key: string) => {
          const data: Record<string, string> = {
            'nodeLabel': 'Test Node',
            'nodeIconCode': 'T',
            'nodeColor': '#FF0000',
            'itemData': 'invalid-json{' // Invalid JSON
          };
          return data[key] || '';
        })
      },
      clientX: 100,
      clientY: 50
    } as unknown as React.DragEvent;

    // Act
    handler(mockEvent);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Error parsing itemData:', expect.any(Error));
    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Array));
    expect(mockEmit).toHaveBeenCalledWith(NODE_ADDED_EVENT, expect.any(Object));

    // Cleanup
    consoleSpy.mockRestore();
  });
});
