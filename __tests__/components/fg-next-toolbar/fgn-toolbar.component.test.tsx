import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FgnToolbarComponent from '../../../src/components/fg-next-toolbar/fgn-toolbar.component';
import { FgnToolbarItem } from '../../../src/components/fg-next-toolbar/model/fgn-toolbar-item.model';
import { IconStrategy } from '../../../src/strategy/icon.strategy';

describe('FgnToolbarComponent', () => {
  const mockItems: FgnToolbarItem[] = [
    {
      id: '1',
      code: 'A',
      color: '#FF9900',
      label: 'Node A'
    },
    {
      id: '2',
      code: 'B',
      color: 'purple',
      label: 'Node B'
    }
  ];

  const mockIconStrategy: IconStrategy = {
    useLetters: true,
    getIcon: (code?: string) => code ? code.charAt(0).toUpperCase() : undefined
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render toolbar with items', () => {
    // Act
    render(<FgnToolbarComponent items={mockItems} />);

    // Assert
    expect(screen.getByText('Node A')).toBeInTheDocument();
    expect(screen.getByText('Node B')).toBeInTheDocument();
  });

  it('should render icons when iconStrategy is provided', () => {
    // Act
    render(
      <FgnToolbarComponent 
        items={mockItems} 
        iconStrategy={mockIconStrategy} 
      />
    );

    // Assert
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should handle drag start with correct data', () => {
    // Act
    render(<FgnToolbarComponent items={mockItems} />);
    
    const item = screen.getByText('Node A');
    
    // Mock dataTransfer
    const mockDataTransfer = {
      setData: jest.fn(),
      setDragImage: jest.fn()
    };
    
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: mockDataTransfer
    });
    
    fireEvent(item, dragStartEvent);

    // Assert
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('nodeLabel', 'Node A');
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('nodeIconCode', 'A');
    expect(mockDataTransfer.setData).toHaveBeenCalledWith('nodeColor', '#FF9900');
  });

  it('should handle item click', () => {
    // Arrange
    const mockOnClick = jest.fn();
    const itemsWithClick: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        onClick: mockOnClick
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithClick} />);
    
    const item = screen.getByText('Node A');
    fireEvent.click(item);

    // Assert
    expect(mockOnClick).toHaveBeenCalledWith(itemsWithClick[0]);
  });

  it('should use custom render function when provided', () => {
    // Arrange
    const mockRenderCustomItem = jest.fn((item, defaultRender) => 
      <div key={item.id} data-testid="custom-item">{item.label}</div>
    );

    // Act
    render(
      <FgnToolbarComponent 
        items={mockItems} 
        renderCustomItem={mockRenderCustomItem} 
      />
    );

    // Assert
    expect(screen.getAllByTestId('custom-item')).toHaveLength(2);
    expect(mockRenderCustomItem).toHaveBeenCalledTimes(2);
  });

  it('should apply custom className and style', () => {
    // Act
    render(
      <FgnToolbarComponent 
        items={mockItems} 
        className="custom-toolbar"
        style={{ backgroundColor: 'red' }}
      />
    );

    // Assert
    const toolbar = screen.getByText('Node A').closest('.fgn-toolbar');
    expect(toolbar).toHaveClass('custom-toolbar');
    expect(toolbar).toHaveStyle('background-color: red');
  });
});
