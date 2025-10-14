import React, { useState } from 'react';
import { useEventBus } from '../../utils/event-system/use-event-bus.hook';
import { CANVAS_EVENTS } from '../fg-next-draw-canvas/model/canvas-events.constants';
import './fgn-zoom.component.css';

interface FgnZoomComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

const FgnZoomComponent: React.FC<FgnZoomComponentProps> = ({ 
  className = '', 
  style 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const { emit } = useEventBus();

  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 2.0;
  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
    setZoomLevel(newZoom);
    emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
    setZoomLevel(newZoom);
    emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
  };

  const handleReset = () => {
    setZoomLevel(1.0);
    emit(CANVAS_EVENTS.ZOOM_CHANGED, 1.0);
  };

  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div className={`fgn-zoom ${className}`} style={style}>
      <button
        className="fgn-zoom-button"
        onClick={handleZoomOut}
        disabled={zoomLevel <= MIN_ZOOM}
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
        disabled={zoomLevel >= MAX_ZOOM}
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
