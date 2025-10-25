import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FgnConnectionComponent from '../../../src/components/fg-next-connection/fgn-connection.component';
import { FgnConnectionModel } from '../../../src/components/fg-next-draw-canvas/model/fgn-connection.model';
import { FgnNodeModel } from '../../../src/components/fg-next-node/model/fgn-node.model';

describe('FgnConnectionComponent', () => {
  const mockConnection: FgnConnectionModel = {
    id: 'conn-1',
    sourceId: 'node-1',
    targetId: 'node-2'
  };

  const mockSourceNode: FgnNodeModel = {
    id: 'node-1',
    x: 0,
    y: 0,
    width: 100,
    height: 50,
    code: 'A',
    label: 'Node A',
    rightConnectionPoint: { x: 100, y: 25 }
  };

  const mockTargetNode: FgnNodeModel = {
    id: 'node-2',
    x: 200,
    y: 0,
    width: 100,
    height: 50,
    code: 'B',
    label: 'Node B',
    leftConnectionPoint: { x: 200, y: 25 }
  };

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render connection path', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    // Assert
    const paths = document.querySelectorAll('path');
    expect(paths).toHaveLength(2); // Invisible path + visible path
  });

  it('should show delete button on hover', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    
    // Hover over connection
    fireEvent.mouseEnter(connectionGroup!);

    // Assert
    const deleteButton = document.querySelector('circle');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    fireEvent.mouseEnter(connectionGroup!);
    
    const deleteButton = document.querySelector('circle');
    fireEvent.click(deleteButton!);

    // Assert
    expect(mockOnDelete).toHaveBeenCalledWith('conn-1');
  });

  it('should hide delete button when not hovered', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    // Assert
    const deleteButton = document.querySelector('circle');
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should render with correct stroke color', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    // Assert
    const visiblePath = document.querySelector('.connection-path');
    expect(visiblePath).toHaveAttribute('stroke', '#9E9E9E');
  });

  it('should hide delete button on mouse leave', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    
    // Hover over connection
    fireEvent.mouseEnter(connectionGroup!);
    
    // Mouse leave
    fireEvent.mouseLeave(connectionGroup!);

    // Assert
    const deleteButton = document.querySelector('circle');
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('should handle delete button mouse down with stopPropagation', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    fireEvent.mouseEnter(connectionGroup!);
    
    const deleteButton = document.querySelector('circle');
    
    // Create mouse down event with stopPropagation
    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
    const stopPropagationSpy = jest.fn();
    Object.defineProperty(mouseDownEvent, 'stopPropagation', { value: stopPropagationSpy });
    
    fireEvent(deleteButton!, mouseDownEvent);

    // Assert
    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should render with correct stroke color when hovered', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    fireEvent.mouseEnter(connectionGroup!);

    // Assert
    const visiblePath = document.querySelector('.connection-path');
    expect(visiblePath).toHaveAttribute('stroke', '#616161');
  });

  it('should render delete button with correct attributes', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    fireEvent.mouseEnter(connectionGroup!);

    // Assert
    const deleteButton = document.querySelector('circle');
    expect(deleteButton).toHaveAttribute('fill', '#E74C3C');
    expect(deleteButton).toHaveAttribute('stroke', 'white');
    expect(deleteButton).toHaveAttribute('stroke-width', '2');
  });

  it('should render delete button lines correctly', () => {
    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={mockConnection}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    const connectionGroup = document.querySelector('.fgn-connection');
    fireEvent.mouseEnter(connectionGroup!);

    // Assert
    const lines = document.querySelectorAll('line');
    expect(lines).toHaveLength(2);
    
    // Check first line (X pattern)
    expect(lines[0]).toHaveAttribute('stroke', 'white');
    expect(lines[0]).toHaveAttribute('stroke-width', '2');
    expect(lines[0]).toHaveAttribute('stroke-linecap', 'round');
    
    // Check second line (X pattern)
    expect(lines[1]).toHaveAttribute('stroke', 'white');
    expect(lines[1]).toHaveAttribute('stroke-width', '2');
    expect(lines[1]).toHaveAttribute('stroke-linecap', 'round');
  });

  it('should handle connection without source or target node', () => {
    // Arrange
    const connectionWithoutNodes = {
      ...mockConnection,
      sourceId: 'non-existent',
      targetId: 'non-existent'
    };

    // Act
    render(
      <svg>
        <FgnConnectionComponent
          connection={connectionWithoutNodes}
          sourceNode={mockSourceNode}
          targetNode={mockTargetNode}
          onDelete={mockOnDelete}
        />
      </svg>
    );

    // Assert - should not throw
    const connectionGroup = document.querySelector('.fgn-connection');
    expect(connectionGroup).toBeInTheDocument();
  });
});
