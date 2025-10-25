import { renderHook, act } from '@testing-library/react';
import { useNodeDrag } from '../../src/components/fg-next-draw-canvas/handler/use-node-drag.handler';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

// Mock dependencies
jest.mock('../../src/utils/calculate-connection-points.util', () => ({
  calculateConnectionPoints: jest.fn(() => ({
    left: { x: 0, y: 25 },
    right: { x: 100, y: 25 }
  }))
}));

describe('useNodeDrag', () => {
  const mockNodes: FgnNodeModel[] = [
    {
      id: 'node-1',
      x: 100, y: 50, width: 150, height: 75,
      code: 'A', label: 'Node A',
      leftConnectionPoint: { x: 100, y: 87.5 },
      rightConnectionPoint: { x: 250, y: 87.5 }
    }
  ];

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
  const eventName = 'NODE_MOVED';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initiate drag on mouseDown', () => {
    // Arrange
    const { result } = renderHook(() =>
      useNodeDrag(mockNodes, mockSetNodes, mockSvgRef, mockEmit, eventName)
    );

    const mockEvent = {
      stopPropagation: jest.fn(),
      clientX: 150,
      clientY: 100
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleNodeMouseDown(mockEvent, 'node-1');
    });

    // Assert
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockSetNodes).not.toHaveBeenCalled(); // No immediate update
  });

  it('should update position on mouseMove', () => {
    // Arrange
    const { result } = renderHook(() =>
      useNodeDrag(mockNodes, mockSetNodes, mockSvgRef, mockEmit, eventName)
    );

    // First, initiate drag
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 150,
      clientY: 100
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleNodeMouseDown(mouseDownEvent, 'node-1');
    });

    // Then move
    const mouseMoveEvent = {
      clientX: 200,
      clientY: 150
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleMouseMove(mouseMoveEvent);
    });

    // Assert
    expect(mockSetNodes).toHaveBeenCalled();
  });

  it('should emit event on mouseUp', () => {
    // Arrange
    const { result } = renderHook(() =>
      useNodeDrag(mockNodes, mockSetNodes, mockSvgRef, mockEmit, eventName)
    );

    // First, initiate drag
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 150,
      clientY: 100
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleNodeMouseDown(mouseDownEvent, 'node-1');
    });

    // Act
    act(() => {
      result.current.handleMouseUp();
    });

    // Assert
    expect(mockEmit).toHaveBeenCalledWith(eventName, expect.any(Object));
  });

  it('should apply zoom and pan offset correctly', () => {
    // Arrange
    const { result } = renderHook(() =>
      useNodeDrag(mockNodes, mockSetNodes, mockSvgRef, mockEmit, eventName, 2.0, { x: 10, y: 20 })
    );

    // First, initiate drag
    const mouseDownEvent = {
      stopPropagation: jest.fn(),
      clientX: 150,
      clientY: 100
    } as unknown as React.MouseEvent;
    act(() => {
      result.current.handleNodeMouseDown(mouseDownEvent, 'node-1');
    });

    // Then move
    const mouseMoveEvent = {
      clientX: 200,
      clientY: 150
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleMouseMove(mouseMoveEvent);
    });

    // Assert
    expect(mockSetNodes).toHaveBeenCalledWith(expect.any(Array));
    const updatedNode = mockSetNodes.mock.calls[0][0][0];

    // Position should be adjusted for zoom and pan
    expect(updatedNode.x).toBeCloseTo(125); // (200 - 0 - 10) / 2 - 25
    expect(updatedNode.y).toBeCloseTo(75); // (150 - 0 - 20) / 2 - 25
  });

  it('should not update if no node is being dragged', () => {
    // Arrange
    const { result } = renderHook(() =>
      useNodeDrag(mockNodes, mockSetNodes, mockSvgRef, mockEmit, eventName)
    );

    const mouseMoveEvent = {
      clientX: 200,
      clientY: 150
    } as unknown as React.MouseEvent;

    // Act
    act(() => {
      result.current.handleMouseMove(mouseMoveEvent);
    });

    // Assert
    expect(mockSetNodes).not.toHaveBeenCalled();
  });
});
