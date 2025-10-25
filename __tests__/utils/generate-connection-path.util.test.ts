import { generateConnectionPath } from '../../src/utils/generate-connection-path.util';
import { ConnectionPoint } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('generateConnectionPath', () => {
  it('should generate SVG path for horizontal connection', () => {
    // Arrange
    const start: ConnectionPoint = { x: 0, y: 50 };
    const end: ConnectionPoint = { x: 100, y: 50 };

    // Act
    const path = generateConnectionPath(start, end);

    // Assert
    expect(path).toMatch(/^M \d+ \d+ C \d+ \d+, \d+ \d+, \d+ \d+$/);
    expect(path).toContain('M 0 50');
    expect(path).toContain('100 50');
  });

  it('should generate path with control points for curved connection', () => {
    // Arrange
    const start: ConnectionPoint = { x: 50, y: 100 };
    const end: ConnectionPoint = { x: 200, y: 100 };

    // Act
    const path = generateConnectionPath(start, end);

    // Assert
    expect(path).toContain('M 50 100');
    expect(path).toContain('200 100');
    // Control points should be calculated based on distance
    expect(path).toContain('C 125 100, 125 100, 200 100');
  });

  it('should handle vertical connection', () => {
    // Arrange
    const start: ConnectionPoint = { x: 100, y: 0 };
    const end: ConnectionPoint = { x: 100, y: 200 };

    // Act
    const path = generateConnectionPath(start, end);

    // Assert
    expect(path).toContain('M 100 0');
    expect(path).toContain('100 200');
  });

  it('should handle negative coordinates', () => {
    // Arrange
    const start: ConnectionPoint = { x: -50, y: -25 };
    const end: ConnectionPoint = { x: 50, y: 25 };

    // Act
    const path = generateConnectionPath(start, end);

    // Assert
    expect(path).toContain('M -50 -25');
    expect(path).toContain('50 25');
  });

  it('should generate consistent path for same input', () => {
    // Arrange
    const start: ConnectionPoint = { x: 10, y: 20 };
    const end: ConnectionPoint = { x: 30, y: 40 };

    // Act
    const path1 = generateConnectionPath(start, end);
    const path2 = generateConnectionPath(start, end);

    // Assert
    expect(path1).toBe(path2);
  });
});
