import { defaultToolbarItems } from '../../src/factory/default-toolbar-items.factory';

describe('defaultToolbarItems', () => {
  it('should have four toolbar items', () => {
    // Assert
    expect(defaultToolbarItems).toHaveLength(4);
  });

  it('should have Node A with correct properties', () => {
    // Arrange
    const nodeA = defaultToolbarItems[0];

    // Assert
    expect(nodeA.id).toBe('1');
    expect(nodeA.code).toBe('A');
    expect(nodeA.color).toBe('#FF9900');
    expect(nodeA.label).toBe('Node A');
  });

  it('should have Node B with correct properties', () => {
    // Arrange
    const nodeB = defaultToolbarItems[1];

    // Assert
    expect(nodeB.id).toBe('2');
    expect(nodeB.code).toBe('B');
    expect(nodeB.color).toBe('purple');
    expect(nodeB.label).toBe('Node B');
  });

  it('should have Node C with correct properties', () => {
    // Arrange
    const nodeC = defaultToolbarItems[2];

    // Assert
    expect(nodeC.id).toBe('3');
    expect(nodeC.code).toBe('C');
    expect(nodeC.color).toBe('#E6526F');
    expect(nodeC.label).toBe('Node C');
  });

  it('should have Node X with correct properties', () => {
    // Arrange
    const nodeX = defaultToolbarItems[3];

    // Assert
    expect(nodeX.id).toBe('4');
    expect(nodeX.code).toBe('X');
    expect(nodeX.color).toBe('#909090');
    expect(nodeX.label).toBe('Node X');
  });

  it('should have unique IDs', () => {
    // Arrange
    const ids = defaultToolbarItems.map(item => item.id);

    // Assert
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have unique codes', () => {
    // Arrange
    const codes = defaultToolbarItems.map(item => item.code);

    // Assert
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });
});
