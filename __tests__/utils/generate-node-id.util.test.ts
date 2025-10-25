import { generateNodeId } from '../../src/utils/generate-node-id.util';

describe('generateNodeId', () => {
  it('should generate a string ID', () => {
    // Act
    const id = generateNodeId();

    // Assert
    expect(typeof id).toBe('string');
    expect(id).toBeTruthy();
  });

  it('should generate string IDs', () => {
    // Act
    const id = generateNodeId();

    // Assert
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('should generate numeric timestamp-based ID', () => {
    // Act
    const id = generateNodeId();
    const timestamp = Date.now();

    // Assert
    expect(Number(id)).toBeLessThanOrEqual(timestamp);
    expect(Number(id)).toBeGreaterThan(timestamp - 1000);
  });
});
