import { FgnNodeModel } from '../components/fg-next-node/model/fgn-node.model';
import { FgnNodeAlignment, FgnNodeAlignmentConfig } from '../components/fg-next-draw-canvas/model/fgn-node-alignment.model';

/**
 * Calculates the X offset for node alignment based on the alignment type
 * @param nodes Array of nodes to align
 * @param config Alignment configuration
 * @returns X offset to apply to the nodes group
 */
export function calculateNodeAlignmentOffset(
  nodes: FgnNodeModel[],
  config: FgnNodeAlignmentConfig
): number {
  if (nodes.length === 0) {
    return 0;
  }

  // Calculate the bounding box of all nodes
  const minX = Math.min(...nodes.map(node => node.x));
  const maxX = Math.max(...nodes.map(node => node.x + node.width));
  const nodesWidth = maxX - minX;

  // Calculate the center of the nodes
  const nodesCenterX = minX + nodesWidth / 2;

  // Calculate the viewport center
  const viewportCenterX = config.viewportWidth / 2;

  switch (config.alignment) {
    case 'left':
      // Align nodes to the left edge of viewport
      return -minX + 50; // 50px margin from left edge
      
    case 'right':
      // Align nodes to the right edge of viewport
      return config.viewportWidth - maxX - 50; // 50px margin from right edge
      
    case 'center':
    default:
      // Center nodes in the viewport
      return viewportCenterX - nodesCenterX;
  }
}

/**
 * Calculates the optimal alignment offset considering zoom and pan
 * @param nodes Array of nodes to align
 * @param config Alignment configuration
 * @param zoomLevel Current zoom level
 * @param panOffset Current pan offset
 * @returns X offset to apply to the nodes group
 */
export function calculateNodeAlignmentOffsetWithTransform(
  nodes: FgnNodeModel[],
  config: FgnNodeAlignmentConfig,
  zoomLevel: number,
  panOffset: { x: number; y: number }
): number {
  const baseOffset = calculateNodeAlignmentOffset(nodes, config);
  
  // Adjust for current zoom and pan
  return (baseOffset - panOffset.x) / zoomLevel;
}
