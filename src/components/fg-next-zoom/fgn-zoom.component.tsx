import React, { useState, useEffect } from 'react';
import { useFgnEventBus, useFgnEventListener } from '../../utils/fg-next-event-system/fgn-use-event-bus.hook';
import { CANVAS_EVENTS } from '../fg-next-draw-canvas/model/canvas-events.constants';
import './fgn-zoom.component.css';

interface FgnZoomComponentProps {
  className?: string;
  style?: React.CSSProperties;
  minZoom?: number;        // Zoom mínimo (default: 0.1 = 10%)
  maxZoom?: number;        // Zoom máximo (default: 2.0 = 200%)
  zoomStep?: number;       // Incremento/decremento del zoom (default: 0.1 = 10%)
  initialZoom?: number;    // Zoom inicial (default: 1.0 = 100%)
  alignment?: 'left' | 'center' | 'right';  // Alineación horizontal (default: 'right')
}

const FgnZoomComponent: React.FC<FgnZoomComponentProps> = ({ 
  className = '', 
  style,
  minZoom = 0.1,
  maxZoom = 5.0,
  zoomStep = 3.5,
  initialZoom = 1.0,
  alignment = 'right'
}) => {
  const ZOOM_BUTTON_STEP = 0.25;
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const { emit } = useFgnEventBus();

  // Emit zoom configuration on mount
  useEffect(() => {
    emit(CANVAS_EVENTS.ZOOM_CONFIG_UPDATED, { minZoom, maxZoom, zoomStep, initialZoom });
  }, [emit, minZoom, maxZoom, zoomStep, initialZoom]);

  // Listen for zoom changes from canvas (touchpad/wheel)
  useFgnEventListener<number>(CANVAS_EVENTS.ZOOM_CHANGED, setZoomLevel);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + ZOOM_BUTTON_STEP, maxZoom);
    setZoomLevel(newZoom);
    // Emit both events - regular zoom change and zoom with point
    emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
    // For buttons, we'll use center of viewport (0, 0) as fallback
    emit(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: newZoom, x: 0, y: 0 });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - ZOOM_BUTTON_STEP, minZoom);
    setZoomLevel(newZoom);
    // Emit both events - regular zoom change and zoom with point
    emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
    // For buttons, we'll use center of viewport (0, 0) as fallback
    emit(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: newZoom, x: 0, y: 0 });
  };

  const handleReset = () => {
    setZoomLevel(initialZoom);
    // Emit reset event to trigger center nodes logic
    emit(CANVAS_EVENTS.ZOOM_RESET, null);
  };

  const zoomPercentage = Math.round(zoomLevel * 100);

  // Generate alignment class
  const alignmentClass = `fgn-zoom-${alignment}`;

  return (
    <div className={`fgn-zoom ${alignmentClass} ${className}`} style={style}>
      <button
        className="fgn-zoom-button"
        onClick={handleZoomOut}
        disabled={zoomLevel <= minZoom}
        title="Zoom Out"
      >
        −
      </button>
      
      <div className="fgn-zoom-display">
        {zoomPercentage}%
      </div>
      
      <button
        className="fgn-zoom-button"
        onClick={handleZoomIn}
        disabled={zoomLevel >= maxZoom}
        title="Zoom In"
      >
        +
      </button>
      
      <button
        className="fgn-zoom-reset"
        onClick={handleReset}
        title="Reset Zoom"
      >
        Reset
      </button>
    </div>
  );
};

export default FgnZoomComponent;
