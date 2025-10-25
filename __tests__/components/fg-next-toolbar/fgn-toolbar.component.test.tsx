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

  it('should handle custom onDragStart handler', () => {
    // Arrange
    const mockOnDragStart = jest.fn();
    const itemsWithCustomDragStart: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        onDragStart: mockOnDragStart
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithCustomDragStart} />);
    
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
    expect(mockOnDragStart).toHaveBeenCalledWith(expect.any(Object), itemsWithCustomDragStart[0]);
  });

  it('should handle item with custom component', () => {
    // Arrange
    const CustomItemComponent = ({ item, onDragStart, onClick }: any) => (
      <div data-testid="custom-item" onClick={() => onClick(item)}>
        Custom: {item.label}
      </div>
    );

    const itemsWithComponent: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        component: CustomItemComponent
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithComponent} />);

    // Assert
    expect(screen.getByTestId('custom-item')).toBeInTheDocument();
    expect(screen.getByText('Custom: Node A')).toBeInTheDocument();
  });

  it('should handle cleanup of drag preview', () => {
    // Arrange
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
    
    // Act
    fireEvent(item, dragStartEvent);

    // Assert - should not throw and cleanup should work
    expect(mockDataTransfer.setData).toHaveBeenCalled();
  });

  it('should handle item without icon', () => {
    // Arrange
    const itemsWithoutIcon: FgnToolbarItem[] = [
      {
        id: '1',
        color: '#FF9900',
        label: 'Node A'
      }
    ];

    const mockIconStrategyNoIcon: IconStrategy = {
      useLetters: false,
      getIcon: () => null
    };

    // Act
    render(
      <FgnToolbarComponent 
        items={itemsWithoutIcon} 
        iconStrategy={mockIconStrategyNoIcon}
      />
    );

    // Assert
    expect(screen.getByText('Node A')).toBeInTheDocument();
    // Check that the node preview div exists when no icon is provided
    const nodePreview = document.querySelector('.fgn-toolbar-node-preview');
    expect(nodePreview).toBeInTheDocument();
  });

  it('should handle item with tooltip', () => {
    // Arrange
    const itemsWithTooltip: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        tooltip: 'Custom Tooltip'
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithTooltip} />);

    // Assert
    expect(screen.getByText('Custom Tooltip')).toBeInTheDocument();
  });

  it('should handle item with custom className', () => {
    // Arrange
    const itemsWithClassName: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        className: 'custom-item-class'
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithClassName} />);

    // Assert
    const item = screen.getByText('Node A').closest('.fgn-toolbar-item');
    expect(item).toHaveClass('custom-item-class');
  });

  it('should handle renderCustomItem function', () => {
    // Arrange
    const mockRenderCustomItem = jest.fn((item, defaultRender) => 
      <div key={item.id} data-testid="custom-render">{item.label}</div>
    );

    // Act
    render(
      <FgnToolbarComponent 
        items={mockItems} 
        renderCustomItem={mockRenderCustomItem} 
      />
    );

    // Assert
    expect(screen.getAllByTestId('custom-render')).toHaveLength(2);
    expect(mockRenderCustomItem).toHaveBeenCalledTimes(2);
  });

  it('should handle keyboard events on toolbar items', () => {
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
    
    // Test Enter key
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledWith(itemsWithClick[0]);

    // Test Space key
    fireEvent.keyDown(item, { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledWith(itemsWithClick[0]);
  });

  it('should not handle other keyboard events on toolbar items', () => {
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
    
    // Test other keys - should not call onClick
    fireEvent.keyDown(item, { key: 'Escape' });
    fireEvent.keyDown(item, { key: 'Tab' });
    fireEvent.keyDown(item, { key: 'ArrowDown' });
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should handle item without code and tooltip', () => {
    // Arrange
    const itemsWithoutCodeAndTooltip: FgnToolbarItem[] = [
      {
        id: '1',
        color: '#FF9900',
        label: 'Node A'
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithoutCodeAndTooltip} />);

    // Assert
    expect(screen.getByText('Node A')).toBeInTheDocument();
    // Should use label as tooltip when tooltip is not provided
    const item = screen.getByRole('button', { name: 'Node A' });
    expect(item).toHaveAttribute('aria-label', 'Node A');
  });

  it('should handle item with undefined code', () => {
    // Arrange
    const itemsWithUndefinedCode: FgnToolbarItem[] = [
      {
        id: '1',
        code: undefined,
        color: '#FF9900',
        label: 'Node A'
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithUndefinedCode} />);

    // Assert
    expect(screen.getByText('Node A')).toBeInTheDocument();
  });

  it('should handle drag preview cleanup when element is not in DOM', () => {
    // Arrange
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
    
    // Act
    fireEvent(item, dragStartEvent);

    // Assert - should not throw even if cleanup tries to remove non-existent element
    expect(mockDataTransfer.setData).toHaveBeenCalled();
  });

  it('should handle custom component with onDragStart', () => {
    // Arrange
    const CustomItemComponent = ({ item, onDragStart, onClick }: any) => (
      <div 
        data-testid="custom-item" 
        onClick={() => onClick(item)}
        onDragStart={(e) => onDragStart(e, item)}
      >
        Custom: {item.label}
      </div>
    );

    const itemsWithComponent: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        component: CustomItemComponent
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithComponent} />);

    // Assert
    expect(screen.getByTestId('custom-item')).toBeInTheDocument();
    expect(screen.getByText('Custom: Node A')).toBeInTheDocument();
  });

  it('should handle item with empty className', () => {
    // Arrange
    const itemsWithEmptyClassName: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        className: ''
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithEmptyClassName} />);

    // Assert
    const item = screen.getByText('Node A').closest('.fgn-toolbar-item');
    expect(item).toHaveClass('fgn-toolbar-item');
    // Empty className should not add any additional class
    expect(item?.className).toBe('fgn-toolbar-item');
  });

  it('should handle item with null className', () => {
    // Arrange
    const itemsWithNullClassName: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        color: '#FF9900',
        label: 'Node A',
        className: null as any
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithNullClassName} />);

    // Assert
    const item = screen.getByText('Node A').closest('.fgn-toolbar-item');
    expect(item).toHaveClass('fgn-toolbar-item');
  });

  it('should handle item without color', () => {
    // Arrange
    const itemsWithoutColor: FgnToolbarItem[] = [
      {
        id: '1',
        code: 'A',
        label: 'Node A'
      }
    ];

    // Act
    render(<FgnToolbarComponent items={itemsWithoutColor} />);

    // Assert
    const item = screen.getByText('Node A');
    expect(item).toBeInTheDocument();
    // Should not have backgroundColor style when color is not provided
    expect(item).not.toHaveStyle('background-color: #FF9900');
  });
});
