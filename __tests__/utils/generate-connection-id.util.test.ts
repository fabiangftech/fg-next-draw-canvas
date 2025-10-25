import { generateConnectionId } from '../../src/utils/generate-connection-id.util';

describe('generateConnectionId', () => {
  it('should generate a string ID with connection prefix', () => {
    // Act
    const id = generateConnectionId();

    // Assert
    expect(typeof id).toBe('string');
    expect(id).toMatch(/^connection_\d+_\d+$/);
  });

  it('should generate different IDs on consecutive calls', () => {
    // Act
    const id1 = generateConnectionId();
    const id2 = generateConnectionId();

    // Assert
    expect(id1).not.toBe(id2);
  });

  it('should include timestamp in the ID', () => {
    // Act
    const id = generateConnectionId();
    const timestamp = Date.now();

    // Assert
    const timestampPart = id.split('_')[1];
    expect(Number(timestampPart)).toBeLessThanOrEqual(timestamp);
    expect(Number(timestampPart)).toBeGreaterThan(timestamp - 1000);
  });

  it('should include counter part', () => {
    // Act
    const id = generateConnectionId();

    // Assert
    const parts = id.split('_');
    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe('connection');
    expect(parts[2]).toMatch(/^\d+$/);
    expect(parts[2].length).toBeGreaterThan(0);
  });
});
