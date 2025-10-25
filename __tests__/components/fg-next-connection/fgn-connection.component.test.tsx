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
});
