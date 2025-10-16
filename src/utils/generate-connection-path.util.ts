import { ConnectionPoint } from '../components/fg-next-node/model/fgn-node.model';

/**
 * Generates SVG path for curved connection between two connection points
 * Uses cubic Bezier curve for smooth, flexible connection
 */
export const generateConnectionPath = (
  start: ConnectionPoint,
  end: ConnectionPoint
): string => {
  const dx = end.x - start.x;
  const controlPointOffset = Math.abs(dx) * 0.5;
  
  // Control points for cubic Bezier curve
  // Creates horizontal outward curve from connection points
  const controlPoint1X = start.x + controlPointOffset;
  const controlPoint1Y = start.y;
  
  const controlPoint2X = end.x - controlPointOffset;
  const controlPoint2Y = end.y;
  
  return `M ${start.x} ${start.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${end.x} ${end.y}`;
};

