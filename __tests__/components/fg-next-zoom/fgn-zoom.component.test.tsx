import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FgnZoomComponent from '../../../src/components/fg-next-zoom/fgn-zoom.component';
import { useFgnEventBus, useFgnEventListener } from '../../../src/utils/fg-next-event-system/fgn-use-event-bus.hook';
import { CANVAS_EVENTS } from '../../../src/components/fg-next-draw-canvas/model/canvas-events.constants';

// Mock the event bus hooks
jest.mock('../../../src/utils/fg-next-event-system/fgn-use-event-bus.hook', () => ({
  useFgnEventBus: jest.fn(),
  useFgnEventListener: jest.fn()
}));

describe('FgnZoomComponent', () => {
  const mockEmit = jest.fn();
  const mockUseFgnEventListener = useFgnEventListener as jest.MockedFunction<typeof useFgnEventListener>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useFgnEventBus as jest.MockedFunction<typeof useFgnEventBus>).mockReturnValue({
      emit: mockEmit,
      on: jest.fn(),
      off: jest.fn()
    });
    mockUseFgnEventListener.mockImplementation(() => {});
  });

  it('should render zoom controls', () => {
    // Act
    render(<FgnZoomComponent />);

    // Assert
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
    expect(screen.getByTitle('Reset Zoom')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should increment zoom when zoom in button is clicked', () => {
    // Act
    render(<FgnZoomComponent />);
    
    const zoomInButton = screen.getByTitle('Zoom In');
    fireEvent.click(zoomInButton);

    // Assert
    expect(mockEmit).toHaveBeenCalledWith(CANVAS_EVENTS.ZOOM_CHANGED, 1.25);
    expect(mockEmit).toHaveBeenCalledWith(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: 1.25, x: 0, y: 0 });
  });

  it('should decrement zoom when zoom out button is clicked', () => {
    // Act
    render(<FgnZoomComponent />);
    
    const zoomOutButton = screen.getByTitle('Zoom Out');
    fireEvent.click(zoomOutButton);

    // Assert
    expect(mockEmit).toHaveBeenCalledWith(CANVAS_EVENTS.ZOOM_CHANGED, 0.75);
    expect(mockEmit).toHaveBeenCalledWith(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: 0.75, x: 0, y: 0 });
  });

  it('should reset zoom when reset button is clicked', () => {
    // Act
    render(<FgnZoomComponent />);
    
    const resetButton = screen.getByTitle('Reset Zoom');
    fireEvent.click(resetButton);

    // Assert
    expect(mockEmit).toHaveBeenCalledWith(CANVAS_EVENTS.ZOOM_RESET, null);
  });

  it('should respect zoom limits', () => {
    // Act
    render(<FgnZoomComponent minZoom={0.5} maxZoom={2.0} />);
    
    const zoomInButton = screen.getByTitle('Zoom In');
    const zoomOutButton = screen.getByTitle('Zoom Out');

    // Assert
    expect(zoomInButton).not.toBeDisabled();
    expect(zoomOutButton).not.toBeDisabled();
  });

  it('should disable zoom out at minimum zoom', () => {
    // Act
    render(<FgnZoomComponent minZoom={1.0} />);
    
    const zoomOutButton = screen.getByTitle('Zoom Out');

    // Assert
    expect(zoomOutButton).toBeDisabled();
  });

  it('should disable zoom in at maximum zoom', () => {
    // Act
    render(<FgnZoomComponent maxZoom={1.0} />);
    
    const zoomInButton = screen.getByTitle('Zoom In');

    // Assert
    expect(zoomInButton).toBeDisabled();
  });

  it('should apply custom alignment class', () => {
    // Act
    render(<FgnZoomComponent alignment="left" />);

    // Assert
    const zoomContainer = screen.getByText('100%').closest('.fgn-zoom');
    expect(zoomContainer).toHaveClass('fgn-zoom-left');
  });

  it('should emit zoom config on mount', () => {
    // Act
    render(<FgnZoomComponent minZoom={0.1} maxZoom={5.0} zoomStep={3.5} initialZoom={1.0} />);

    // Assert
    expect(mockEmit).toHaveBeenCalledWith(CANVAS_EVENTS.ZOOM_CONFIG_UPDATED, {
      minZoom: 0.1,
      maxZoom: 5.0,
      zoomStep: 3.5,
      initialZoom: 1.0
    });
  });
});
