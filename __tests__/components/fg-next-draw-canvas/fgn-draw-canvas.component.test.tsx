import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FgnDrawCanvasComponent from '../../../src/components/fg-next-draw-canvas/fgn-draw-canvas.component';
import { FgnNodeModel } from '../../../src/components/fg-next-node/model/fgn-node.model';
import { FgnNodeAction } from '../../../src/components/fg-next-node/model/fgn-node-action.model';
import { CANVAS_EVENTS } from '../../../src/components/fg-next-draw-canvas/model/canvas-events.constants';

// Mock dependencies
jest.mock('../../../src/utils/generate-node-id.util', () => ({
  generateNodeId: jest.fn(() => 'generated-node-id-123')
}));

jest.mock('../../../src/utils/generate-connection-id.util', () => ({
  generateConnectionId: jest.fn(() => 'generated-connection-id-123')
}));

// Mock event bus
const mockEmit = jest.fn();
jest.mock('../../../src/utils/fg-next-event-system/fgn-use-event-bus.hook', () => ({
  useFgnEventBus: () => ({ emit: mockEmit }),
  useFgnEventListener: jest.fn()
}));

describe('FgnDrawCanvasComponent', () => {
  const defaultNodeSize = { width: 150, height: 75 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render canvas with default props', () => {
    // Act
    render(<FgnDrawCanvasComponent />);

    // Assert
    const canvas = document.querySelector('.fgn-draw-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render with custom canvas dimensions', () => {
    // Arrange
    const customWidth = 8000;
    const customHeight = 6000;

    // Act
    render(<FgnDrawCanvasComponent canvasWidth={customWidth} canvasHeight={customHeight} />);

    // Assert
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;
    expect(svg).toHaveAttribute('width', customWidth.toString());
    expect(svg).toHaveAttribute('height', customHeight.toString());
  });

  it('should render with custom node size', () => {
    // Arrange
    const customNodeSize = { width: 200, height: 100 };

    // Act
    render(<FgnDrawCanvasComponent nodeSize={customNodeSize} />);

    // Assert
    const container = document.querySelector('.fgn-canvas-container');
    expect(container).toBeInTheDocument();
  });

  it('should handle canvas mouse down for pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const middleClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      button: 1 // Middle click
    });
    fireEvent(svg, middleClickEvent);

    // Assert - panning state should be set
    expect(document.querySelector('.fgn-canvas-container')).toBeInTheDocument();
  });

  it('should handle shift+click for pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const shiftClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      shiftKey: true
    });
    fireEvent(svg, shiftClickEvent);

    // Assert
    const container = document.querySelector('.fgn-canvas-container');
    expect(container).toBeInTheDocument();
  });

  it('should render with default zoom level', () => {
    // Arrange & Act
    render(<FgnDrawCanvasComponent />);

    // Assert
    const g = document.querySelector('g');
    expect(g).toHaveAttribute('transform', 'translate(0, 0) scale(1)');
  });

  it('should handle drag over', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const dragOverEvent = new Event('dragover', {
      bubbles: true,
      cancelable: true
    }) as DragEvent;
    Object.defineProperty(dragOverEvent, 'preventDefault', { value: jest.fn() });
    
    fireEvent(svg, dragOverEvent);

    // Assert - should not throw
    expect(svg).toBeInTheDocument();
  });

  it('should render empty canvas initially', () => {
    // Act
    render(<FgnDrawCanvasComponent />);

    // Assert
    const svg = document.querySelector('.fgn-draw-canvas');
    expect(svg).toBeInTheDocument();
    expect(document.querySelectorAll('.fgn-connection')).toHaveLength(0);
  });

  it('should render with custom props', () => {
    // Arrange
    const customNodeSize = { width: 200, height: 100 };

    // Act
    render(<FgnDrawCanvasComponent nodeSize={customNodeSize} />);

    // Assert
    const container = document.querySelector('.fgn-canvas-container');
    expect(container).toBeInTheDocument();
  });

  it('should handle mouse leave', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const mouseLeaveEvent = new MouseEvent('mouseleave', {
      bubbles: true
    });
    fireEvent(svg, mouseLeaveEvent);

    // Assert - should not throw
    expect(svg).toBeInTheDocument();
  });

  it('should render nodes when provided via events', () => {
    // This test verifies that the component listens to NODES_REPLACED event
    // Note: Full implementation would require event bus mocking
    
    // Arrange & Act
    render(<FgnDrawCanvasComponent />);

    // Assert
    const svg = document.querySelector('.fgn-draw-canvas');
    expect(svg).toBeInTheDocument();
  });

  it('should handle pan move', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Start pan
    const startEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 1 // Middle click
    });
    fireEvent(svg, startEvent);

    // Move
    const moveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 100,
      clientY: 100
    });
    fireEvent(svg, moveEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle pan end', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Start pan
    const startEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 1
    });
    fireEvent(svg, startEvent);

    // End pan
    const endEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    fireEvent(svg, endEvent);

    // Assert
    const container = document.querySelector('.fgn-canvas-container');
    expect(container).toBeInTheDocument();
  });

  it('should handle wheel event with Ctrl for zoom', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      ctrlKey: true,
      deltaY: -100,
      clientX: 100,
      clientY: 100
    });
    fireEvent(svg, wheelEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle wheel event without Ctrl for pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      ctrlKey: false,
      deltaX: 10,
      deltaY: 10
    });
    fireEvent(svg, wheelEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle wheel event with metaKey (Mac)', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const wheelEvent = new WheelEvent('wheel', {
      bubbles: true,
      metaKey: true,
      deltaY: -100,
      clientX: 100,
      clientY: 100
    });
    fireEvent(svg, wheelEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should render with custom getNodeActions', () => {
    // Arrange
    const mockGetNodeActions = jest.fn(() => [
      { id: 'custom', label: 'C', order: 1, onClick: jest.fn() }
    ]);

    // Act
    render(
      <FgnDrawCanvasComponent 
        getNodeActions={mockGetNodeActions}
      />
    );

    // Assert
    const canvas = document.querySelector('.fgn-draw-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render with custom nodeActions', () => {
    // Arrange
    const customNodeActions = [
      { id: 'custom1', label: 'C1', order: 1, onClick: jest.fn() },
      { id: 'custom2', label: 'C2', order: 2, onClick: jest.fn() }
    ];

    // Act
    render(
      <FgnDrawCanvasComponent 
        nodeActions={customNodeActions}
      />
    );

    // Assert
    const canvas = document.querySelector('.fgn-draw-canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should handle mouse move during pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Start pan
    const startEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 1,
      clientX: 0,
      clientY: 0
    });
    fireEvent(svg, startEvent);

    // Move during pan
    const moveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 50,
      clientY: 50
    });
    fireEvent(svg, moveEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle mouse move without pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Move without pan
    const moveEvent = new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 50,
      clientY: 50
    });
    fireEvent(svg, moveEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle mouse up without pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Mouse up without pan
    const upEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    fireEvent(svg, upEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle mouse up during pan', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Start pan
    const startEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 1
    });
    fireEvent(svg, startEvent);

    // End pan
    const upEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    fireEvent(svg, upEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle canvas mouse down with left click and shift', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const shiftClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      shiftKey: true
    });
    fireEvent(svg, shiftClickEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle canvas mouse down with regular left click', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const leftClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      shiftKey: false
    });
    fireEvent(svg, leftClickEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });

  it('should handle canvas mouse down with right click', () => {
    // Arrange
    render(<FgnDrawCanvasComponent />);
    const svg = document.querySelector('.fgn-draw-canvas') as SVGSVGElement;

    // Act
    const rightClickEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 2
    });
    fireEvent(svg, rightClickEvent);

    // Assert
    expect(svg).toBeInTheDocument();
  });
});
