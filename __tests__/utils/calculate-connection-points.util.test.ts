import { calculateConnectionPoints } from '../../src/utils/calculate-connection-points.util';
import { ConnectionPoint } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('calculateConnectionPoints', () => {
  it('should calculate correct connection points for a standard node', () => {
    // Arrange
    const x = 100;
    const y = 50;
    const width = 200;
    const height = 100;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    const expectedLeft: ConnectionPoint = {
      x: 100,
      y: 100 // y + height/2 = 50 + 100/2 = 100
    };
    const expectedRight: ConnectionPoint = {
      x: 300, // x + width = 100 + 200 = 300
      y: 100  // y + height/2 = 50 + 100/2 = 100
    };

    expect(result.left).toEqual(expectedLeft);
    expect(result.right).toEqual(expectedRight);
  });

  it('should calculate correct connection points for a square node', () => {
    // Arrange
    const x = 0;
    const y = 0;
    const width = 50;
    const height = 50;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left).toEqual({ x: 0, y: 25 });
    expect(result.right).toEqual({ x: 50, y: 25 });
  });

  it('should handle zero dimensions', () => {
    // Arrange
    const x = 10;
    const y = 20;
    const width = 0;
    const height = 0;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left).toEqual({ x: 10, y: 20 });
    expect(result.right).toEqual({ x: 10, y: 20 });
  });

  it('should handle negative coordinates', () => {
    // Arrange
    const x = -50;
    const y = -30;
    const width = 100;
    const height = 60;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left).toEqual({ x: -50, y: 0 }); // -30 + 60/2 = 0
    expect(result.right).toEqual({ x: 50, y: 0 });  // -50 + 100 = 50
  });

  it('should handle very small dimensions', () => {
    // Arrange
    const x = 0.5;
    const y = 0.3;
    const width = 1.0;
    const height = 0.8;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left).toEqual({ x: 0.5, y: 0.7 }); // 0.3 + 0.8/2 = 0.7
    expect(result.right).toEqual({ x: 1.5, y: 0.7 }); // 0.5 + 1.0 = 1.5
  });

  it('should handle large dimensions', () => {
    // Arrange
    const x = 1000;
    const y = 2000;
    const width = 5000;
    const height = 3000;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left).toEqual({ x: 1000, y: 3500 }); // 2000 + 3000/2 = 3500
    expect(result.right).toEqual({ x: 6000, y: 3500 }); // 1000 + 5000 = 6000
  });

  it('should return consistent results for same input', () => {
    // Arrange
    const x = 100;
    const y = 200;
    const width = 300;
    const height = 400;

    // Act
    const result1 = calculateConnectionPoints(x, y, width, height);
    const result2 = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result1).toEqual(result2);
  });

  it('should have left point always on the left side', () => {
    // Arrange
    const x = 50;
    const y = 100;
    const width = 200;
    const height = 150;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left.x).toBeLessThan(result.right.x);
    expect(result.left.x).toBe(x);
    expect(result.right.x).toBe(x + width);
  });

  it('should have both points at the same vertical level', () => {
    // Arrange
    const x = 0;
    const y = 0;
    const width = 100;
    const height = 200;

    // Act
    const result = calculateConnectionPoints(x, y, width, height);

    // Assert
    expect(result.left.y).toBe(result.right.y);
    expect(result.left.y).toBe(y + height / 2);
  });
});
