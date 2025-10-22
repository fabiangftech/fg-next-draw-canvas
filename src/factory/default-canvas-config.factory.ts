import { FgnNodeAlignment } from '../components/fg-next-draw-canvas/model/fgn-node-alignment.model';

/**
 * Default canvas configuration for the system
 */
export const defaultCanvasConfig = {
  defaultNodeSize: { width: 180, height: 90 },
  maxVisibleActions: 2,
  nodeAlignment: 'center' as FgnNodeAlignment,
  zoom: {
    minZoom: 0.5,
    maxZoom: 3.0,
    zoomStep:2.0,
    initialZoom: 1.0
  }
};

