import { calculatePathMidpoint } from '../../src/utils/calculate-path-midpoint.util';
import { ConnectionPoint } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('calculatePathMidpoint', () => {
  it('should calculate midpoint for horizontal connection', () => {
    // Arrange
    const start: ConnectionPoint = { x: 0, y: 50 };
    const end: ConnectionPoint = { x: 100, y: 50 };

    // Act
    const midpoint = calculatePathMidpoint(start, end);

    // Assert
    expect(midpoint.x).toBeCloseTo(50, 1);
    expect(midpoint.y).toBeCloseTo(50, 1);
  });

  it('should calculate midpoint for vertical connection', () => {
    // Arrange
    const start: ConnectionPoint = { x: 100, y: 0 };
    const end: ConnectionPoint = { x: 100, y: 200 };

    // Act
    const midpoint = calculatePathMidpoint(start, end);

    // Assert
    expect(midpoint.x).toBeCloseTo(100, 1);
    expect(midpoint.y).toBeCloseTo(100, 1);
  });

  it('should calculate midpoint for diagonal connection', () => {
    // Arrange
    const start: ConnectionPoint = { x: 0, y: 0 };
    const end: ConnectionPoint = { x: 100, y: 100 };

    // Act
    const midpoint = calculatePathMidpoint(start, end);

    // Assert
    expect(midpoint.x).toBeCloseTo(50, 1);
    expect(midpoint.y).toBeCloseTo(50, 1);
  });

  it('should handle negative coordinates', () => {
    // Arrange
    const start: ConnectionPoint = { x: -50, y: -25 };
    const end: ConnectionPoint = { x: 50, y: 25 };

    // Act
    const midpoint = calculatePathMidpoint(start, end);

    // Assert
    expect(midpoint.x).toBeCloseTo(0, 1);
    expect(midpoint.y).toBeCloseTo(0, 1);
  });

  it('should return consistent result for same input', () => {
    // Arrange
    const start: ConnectionPoint = { x: 10, y: 20 };
    const end: ConnectionPoint = { x: 30, y: 40 };

    // Act
    const midpoint1 = calculatePathMidpoint(start, end);
    const midpoint2 = calculatePathMidpoint(start, end);

    // Assert
    expect(midpoint1).toEqual(midpoint2);
  });
});
