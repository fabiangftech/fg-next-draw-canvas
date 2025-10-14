import { ConnectionPoint } from '../components/fg-next-draw-node/model/fgn-node.model';

/**
 * Calculates approximate midpoint of a Bezier curve path
 * Used for positioning delete button
 */
export const calculatePathMidpoint = (
  start: ConnectionPoint,
  end: ConnectionPoint
): ConnectionPoint => {
  // For cubic Bezier, approximate midpoint using parameter t=0.5
  const dx = end.x - start.x;
  const controlPointOffset = Math.abs(dx) * 0.5;
  
  const controlPoint1X = start.x + controlPointOffset;
  const controlPoint1Y = start.y;
  
  const controlPoint2X = end.x - controlPointOffset;
  const controlPoint2Y = end.y;
  
  // Cubic Bezier point calculation at t=0.5
  const t = 0.5;
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  
  const x = mt3 * start.x + 3 * mt2 * t * controlPoint1X + 3 * mt * t2 * controlPoint2X + t3 * end.x;
  const y = mt3 * start.y + 3 * mt2 * t * controlPoint1Y + 3 * mt * t2 * controlPoint2Y + t3 * end.y;
  
  return { x, y };
};

