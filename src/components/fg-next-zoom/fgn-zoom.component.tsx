import React, { useState } from 'react';
import { useEventBus, useEventListener } from '../../utils/event-system/use-event-bus.hook';
import { CANVAS_EVENTS } from '../fg-next-draw-canvas/model/canvas-events.constants';
import './fgn-zoom.component.css';

interface FgnZoomComponentProps {
  className?: string;
  style?: React.CSSProperties;
  minZoom?: number;        // Zoom mínimo (default: 0.1 = 10%)
  maxZoom?: number;        // Zoom máximo (default: 2.0 = 200%)
  zoomStep?: number;       // Incremento/decremento del zoom (default: 0.1 = 10%)
  initialZoom?: number;    // Zoom inicial (default: 1.0 = 100%)
}

const FgnZoomComponent: React.FC<FgnZoomComponentProps> = ({ 
  className = '', 
  style,
  minZoom = 0.1,
  maxZoom = 2.0,
  zoomStep = 0.1,
  initialZoom = 1.0
}) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const { emit } = useEventBus();

  // Listen for zoom changes from canvas (touchpad/wheel)
  useEventListener<number>(CANVAS_EVENTS.ZOOM_CHANGED, setZoomLevel);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + zoomStep, maxZoom);
    setZoomLevel(newZoom);
    // Emit both events - regular zoom change and zoom with point
    emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
    // For buttons, we'll use center of viewport (0, 0) as fallback
    emit(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: newZoom, x: 0, y: 0 });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - zoomStep, minZoom);
    setZoomLevel(newZoom);
    // Emit both events - regular zoom change and zoom with point
    emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
    // For buttons, we'll use center of viewport (0, 0) as fallback
    emit(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: newZoom, x: 0, y: 0 });
  };

  const handleReset = () => {
    setZoomLevel(initialZoom);
    // Emit both events - regular zoom change and zoom with point
    emit(CANVAS_EVENTS.ZOOM_CHANGED, initialZoom);
    // For reset, we'll use center of viewport (0, 0) as fallback
    emit(CANVAS_EVENTS.ZOOM_WITH_POINT, { zoom: initialZoom, x: 0, y: 0 });
  };

  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div className={`fgn-zoom ${className}`} style={style}>
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
