import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FgnNodeComponent from '../../../src/components/fg-next-node/fgn-node.component';
import { FgnNodeModel } from '../../../src/components/fg-next-node/model/fgn-node.model';
import { FgnNodeAction } from '../../../src/components/fg-next-node/model/fgn-node-action.model';
import { IconStrategy } from '../../../src/strategy/icon.strategy';
import { StatusStrategy } from '../../../src/strategy/status.strategy';

describe('FgnNodeComponent', () => {
  const mockNode: FgnNodeModel = {
    id: 'node-1',
    x: 100,
    y: 50,
    width: 200,
    height: 100,
    code: 'A',
    label: 'Test Node',
    leftConnectionPoint: { x: 100, y: 100 },
    rightConnectionPoint: { x: 300, y: 100 }
  };

  const mockActions: FgnNodeAction[] = [
    {
      id: 'Edit',
      label: 'E',
      order: 1,
      onClick: jest.fn()
    },
    {
      id: 'Delete',
      label: 'D',
      order: 2,
      onClick: jest.fn()
    }
  ];

  const mockIconStrategy: IconStrategy = {
    useLetters: true,
    getIcon: (code?: string) => code ? code.charAt(0).toUpperCase() : undefined
  };

  const mockStatusStrategy: StatusStrategy = {
    defaultStatus: 'default',
    getStyle: (status: string) => ({
      backgroundColor: '#2196F3',
      textColor: 'white',
      borderColor: '#1976D2'
    })
  };

  const mockOnMouseDown = jest.fn();
  const mockOnConnectionPointMouseDown = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render node with label', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    // Assert
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('should render connection points', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    // Assert
    const connectionPoints = document.querySelectorAll('.fgn-node-connection-point');
    expect(connectionPoints).toHaveLength(2);
  });

  it('should render actions when available', () => {
    // Arrange
    const nodeWithActions = { ...mockNode, actions: mockActions };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithActions}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    // Assert
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('D')).toBeInTheDocument();
  });

  it('should render status badge when status is provided', () => {
    // Arrange
    const nodeWithStatus = { ...mockNode, status: 'active' };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithStatus}
          onMouseDown={mockOnMouseDown}
          statusStrategy={mockStatusStrategy}
        />
      </svg>
    );

    // Assert
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('should render icon when iconStrategy is provided', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
          iconStrategy={mockIconStrategy}
        />
      </svg>
    );

    // Assert
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should call onMouseDown when node is clicked', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    const nodeGroup = screen.getByText('Test Node').closest('g');
    fireEvent.mouseDown(nodeGroup!);

    // Assert
    expect(mockOnMouseDown).toHaveBeenCalledWith(expect.any(Object), 'node-1');
  });

  it('should call onConnectionPointMouseDown when connection point is clicked', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
          onConnectionPointMouseDown={mockOnConnectionPointMouseDown}
        />
      </svg>
    );

    const leftPoint = document.querySelector('[data-connection-type="left"]');
    fireEvent.mouseDown(leftPoint!);

    // Assert
    expect(mockOnConnectionPointMouseDown).toHaveBeenCalledWith(
      expect.any(Object), 
      'node-1', 
      'left'
    );
  });

  it('should execute action when action button is clicked', () => {
    // Arrange
    const nodeWithActions = { ...mockNode, actions: mockActions };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithActions}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    const editButton = screen.getByText('E');
    fireEvent.click(editButton);

    // Assert
    expect(mockActions[0].onClick).toHaveBeenCalledWith('node-1');
  });

  it('should show dropdown when there are more actions than maxVisible', () => {
    // Arrange
    const manyActions: FgnNodeAction[] = [
      { id: 'Action1', label: 'A1', order: 1, onClick: jest.fn() },
      { id: 'Action2', label: 'A2', order: 2, onClick: jest.fn() },
      { id: 'Action3', label: 'A3', order: 3, onClick: jest.fn() },
      { id: 'Action4', label: 'A4', order: 4, onClick: jest.fn() }
    ];
    const nodeWithManyActions = { ...mockNode, actions: manyActions };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithManyActions}
          onMouseDown={mockOnMouseDown}
          maxVisibleActions={2}
        />
      </svg>
    );

    // Assert
    expect(screen.getByText('⋮')).toBeInTheDocument();
  });

  it('should hide actions when shouldShowActions returns false', () => {
    // Arrange
    const nodeWithActions = { ...mockNode, actions: mockActions };
    const shouldShowActions = () => false;

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithActions}
          onMouseDown={mockOnMouseDown}
          shouldShowActions={shouldShowActions}
        />
      </svg>
    );

    // Assert
    expect(screen.queryByText('E')).not.toBeInTheDocument();
    expect(screen.queryByText('D')).not.toBeInTheDocument();
  });

  it('should handle action.isDisabled as function', () => {
    // Arrange
    const actionsWithDisabledFunction: FgnNodeAction[] = [
      {
        id: 'Edit',
        label: 'E',
        order: 1,
        onClick: jest.fn(),
        isDisabled: (node) => node.id === 'node-1'
      }
    ];
    const nodeWithActions = { ...mockNode, actions: actionsWithDisabledFunction };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithActions}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    // Assert
    const editButton = screen.getByText('E');
    expect(editButton).toBeDisabled();
  });

  it('should handle action.isDisabled as boolean', () => {
    // Arrange
    const actionsWithDisabledBoolean: FgnNodeAction[] = [
      {
        id: 'Edit',
        label: 'E',
        order: 1,
        onClick: jest.fn(),
        disabled: true
      }
    ];
    const nodeWithActions = { ...mockNode, actions: actionsWithDisabledBoolean };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithActions}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    // Assert
    const editButton = screen.getByText('E');
    expect(editButton).toBeDisabled();
  });

  it('should handle left connection point mouse down without handler', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    const leftPoint = document.querySelector('[data-connection-type="left"]');
    fireEvent.mouseDown(leftPoint!);

    // Assert - should not throw
    expect(leftPoint).toBeInTheDocument();
  });

  it('should handle right connection point mouse down without handler', () => {
    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={mockNode}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    const rightPoint = document.querySelector('[data-connection-type="right"]');
    fireEvent.mouseDown(rightPoint!);

    // Assert - should not throw
    expect(rightPoint).toBeInTheDocument();
  });

  it('should handle dropdown toggle', () => {
    // Arrange
    const manyActions: FgnNodeAction[] = [
      { id: 'Action1', label: 'A1', order: 1, onClick: jest.fn() },
      { id: 'Action2', label: 'A2', order: 2, onClick: jest.fn() },
      { id: 'Action3', label: 'A3', order: 3, onClick: jest.fn() },
      { id: 'Action4', label: 'A4', order: 4, onClick: jest.fn() }
    ];
    const nodeWithManyActions = { ...mockNode, actions: manyActions };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithManyActions}
          onMouseDown={mockOnMouseDown}
          maxVisibleActions={2}
        />
      </svg>
    );

    const dropdownButton = screen.getByText('⋮');
    fireEvent.click(dropdownButton);

    // Assert
    expect(screen.getByText('A3 Action3')).toBeInTheDocument();
    expect(screen.getByText('A4 Action4')).toBeInTheDocument();
  });

  it('should handle dropdown action click', () => {
    // Arrange
    const mockAction3 = jest.fn();
    const manyActions: FgnNodeAction[] = [
      { id: 'Action1', label: 'A1', order: 1, onClick: jest.fn() },
      { id: 'Action2', label: 'A2', order: 2, onClick: jest.fn() },
      { id: 'Action3', label: 'A3', order: 3, onClick: mockAction3 },
      { id: 'Action4', label: 'A4', order: 4, onClick: jest.fn() }
    ];
    const nodeWithManyActions = { ...mockNode, actions: manyActions };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithManyActions}
          onMouseDown={mockOnMouseDown}
          maxVisibleActions={2}
        />
      </svg>
    );

    const dropdownButton = screen.getByText('⋮');
    fireEvent.click(dropdownButton);

    const action3Button = screen.getByText('A3 Action3');
    fireEvent.click(action3Button);

    // Assert
    expect(mockAction3).toHaveBeenCalledWith('node-1');
  });

  it('should handle actions wrapper mouse down', () => {
    // Arrange
    const nodeWithActions = { ...mockNode, actions: mockActions };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithActions}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    const actionsWrapper = document.querySelector('.node-actions');
    const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(mouseDownEvent, 'stopPropagation', { value: jest.fn() });
    
    fireEvent(actionsWrapper!, mouseDownEvent);

    // Assert - should not throw
    expect(actionsWrapper).toBeInTheDocument();
  });

  it('should render bottom left label when provided', () => {
    // Arrange
    const nodeWithBottomLabel = { ...mockNode, bottomLeftLabel: 'Bottom Label' };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithBottomLabel}
          onMouseDown={mockOnMouseDown}
        />
      </svg>
    );

    // Assert
    expect(screen.getByText('Bottom Label')).toBeInTheDocument();
  });

  it('should render node with custom color', () => {
    // Arrange
    const nodeWithColor = { ...mockNode, color: '#FF0000' };

    // Act
    render(
      <svg>
        <FgnNodeComponent
          node={nodeWithColor}
          onMouseDown={mockOnMouseDown}
          iconStrategy={mockIconStrategy}
        />
      </svg>
    );

    // Assert
    const iconWrapper = document.querySelector('.fgn-node-icon-wrapper');
    expect(iconWrapper).toHaveStyle('color: #FF0000');
  });
});
