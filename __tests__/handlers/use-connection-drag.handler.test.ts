import { renderHook, act } from '@testing-library/react';
import { useConnectionDrag } from '../../src/components/fg-next-draw-canvas/handler/use-connection-drag.handler';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';
import { FgnConnectionModel } from '../../src/components/fg-next-draw-canvas/model/fgn-connection.model';

// Mock dependencies
jest.mock('../../src/utils/generate-connection-id.util', () => ({
  generateConnectionId: jest.fn(() => 'generated-connection-id-123')
}));

describe('useConnectionDrag', () => {
  const mockNodes: FgnNodeModel[] = [
    {
      id: 'node-1',
      x: 100, y: 50, width: 150, height: 75,
      code: 'A', label: 'Node A',
      leftConnectionPoint: { x: 100, y: 87.5 },
      rightConnectionPoint: { x: 250, y: 87.5 }
    },
    {
      id: 'node-2',
      x: 300, y: 50, width: 150, height: 75,
      code: 'B', label: 'Node B',
      leftConnectionPoint: { x: 300, y: 87.5 },
      rightConnectionPoint: { x: 450, y: 87.5 }
    }
  ];

  const mockConnections: FgnConnectionModel[] = [];
  const mockSetNodes = jest.fn();
  const mockSetConnections = jest.fn();
  const mockSvgRef = {
    current: {
      getBoundingClientRect: jest.fn(() => ({
        left: 0,
        top: 0
      }))
    }
  } as React.RefObject<SVGSVGElement>;
  const mockEmit = jest.fn();
  const CONNECTION_CREATED_EVENT = 'CONNECTION_CREATED';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate preview on mouseDown from right point', () => {
    // Arrange
    const { result } = renderHook(() =>
      useConnectionDrag({
        nodes: mockNodes,
        setNodes: mockSetNodes,
        connections: mockConnections,
        setConnections: mockSetConnections,
        svgRef: mockSvgRef,
        emit: mockEmit,
        CONNECTION_CREATED_EVENT
      })
    );

    const mockEvent = {
      stopPropagation: jest.fn(),
      clientX: 250,
      clientY: 87.5
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleConnectionPointMouseDown(mockEvent, 'node-1', 'right');
    });

    // Assert
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.connectionPreview).toEqual({
      start: { x: 250, y: 87.5 },
      end: { x: 250, y: 87.5 }
    });
  });

  it('should not initiate preview from left point', () => {
    // Arrange
    const { result } = renderHook(() =>
      useConnectionDrag({
        nodes: mockNodes,
        setNodes: mockSetNodes,
        connections: mockConnections,
        setConnections: mockSetConnections,
        svgRef: mockSvgRef,
        emit: mockEmit,
        CONNECTION_CREATED_EVENT
      })
    );

    const mockEvent = {
      stopPropagation: jest.fn(),
      clientX: 100,
      clientY: 87.5
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleConnectionPointMouseDown(mockEvent, 'node-1', 'left');
    });

    // Assert
    expect(result.current.connectionPreview).toBeNull();
  });

  it('should update preview on mouseMove', () => {
    // Arrange
    const { result } = renderHook(() =>
      useConnectionDrag({
        nodes: mockNodes,
        setNodes: mockSetNodes,
        connections: mockConnections,
        setConnections: mockSetConnections,
        svgRef: mockSvgRef,
        emit: mockEmit,
        CONNECTION_CREATED_EVENT
      })
    );

    // First, initiate preview
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 250,
      clientY: 87.5
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleConnectionPointMouseDown(mouseDownEvent, 'node-1', 'right');
    });

    // Then move
    const mouseMoveEvent = {
      clientX: 300,
      clientY: 100
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleConnectionMouseMove(mouseMoveEvent);
    });

    // Assert
    expect(result.current.connectionPreview).toEqual({
      start: { x: 250, y: 87.5 },
      end: { x: 300, y: 100 }
    });
  });

  it('should create connection on valid mouseUp', () => {
    // Arrange
    const { result } = renderHook(() =>
      useConnectionDrag({
        nodes: mockNodes,
        setNodes: mockSetNodes,
        connections: mockConnections,
        setConnections: mockSetConnections,
        svgRef: mockSvgRef,
        emit: mockEmit,
        CONNECTION_CREATED_EVENT
      })
    );

    // First, initiate preview
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 250,
      clientY: 87.5
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleConnectionPointMouseDown(mouseDownEvent, 'node-1', 'right');
    });

    // Then release on left point
    const mouseUpEvent = {
      target: {
        dataset: {
          nodeId: 'node-2',
          connectionType: 'left'
        }
      }
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleConnectionMouseUp(mouseUpEvent);
    });

    // Assert
    expect(mockSetConnections).toHaveBeenCalled();
    expect(mockSetNodes).toHaveBeenCalled();
    expect(mockEmit).toHaveBeenCalledWith(CONNECTION_CREATED_EVENT, expect.any(Object));
  });

  it('should not create duplicate connection', () => {
    // Arrange
    const existingConnections: FgnConnectionModel[] = [
      { id: 'conn-1', sourceNodeId: 'node-1', targetNodeId: 'node-2' }
    ];

    const { result } = renderHook(() =>
      useConnectionDrag({
        nodes: mockNodes,
        setNodes: mockSetNodes,
        connections: existingConnections,
        setConnections: mockSetConnections,
        svgRef: mockSvgRef,
        emit: mockEmit,
        CONNECTION_CREATED_EVENT
      })
    );

    // First, initiate preview
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 250,
      clientY: 87.5
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleConnectionPointMouseDown(mouseDownEvent, 'node-1', 'right');
    });

    // Then release on left point
    const mouseUpEvent = {
      target: {
        dataset: {
          nodeId: 'node-2',
          connectionType: 'left'
        }
      }
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleConnectionMouseUp(mouseUpEvent);
    });

    // Assert
    expect(mockSetConnections).not.toHaveBeenCalled();
    expect(mockSetNodes).not.toHaveBeenCalled();
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it('should reset preview state on mouseUp', () => {
    // Arrange
    const { result } = renderHook(() =>
      useConnectionDrag({
        nodes: mockNodes,
        setNodes: mockSetNodes,
        connections: mockConnections,
        setConnections: mockSetConnections,
        svgRef: mockSvgRef,
        emit: mockEmit,
        CONNECTION_CREATED_EVENT
      })
    );

    // First, initiate preview
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 250,
      clientY: 87.5
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleConnectionPointMouseDown(mouseDownEvent, 'node-1', 'right');
    });

    // Then release
    const mouseUpEvent = {
      target: {
        dataset: {}
      }
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleConnectionMouseUp(mouseUpEvent);
    });

    // Assert
    expect(result.current.connectionPreview).toBeNull();
  });
});
