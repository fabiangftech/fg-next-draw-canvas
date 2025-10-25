import { defaultCreateNodeByCode } from '../../src/factory/default-node-factory.factory';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('defaultCreateNodeByCode', () => {
  it('should return same data when called with partial node data', () => {
    // Arrange
    const nodeData: Partial<FgnNodeModel> = {
      id: 'test-id',
      code: 'A',
      label: 'Test Node'
    };

    // Act
    const result = defaultCreateNodeByCode(nodeData);

    // Assert
    expect(result).toEqual(nodeData);
  });

  it('should return empty object when called with empty data', () => {
    // Arrange
    const nodeData: Partial<FgnNodeModel> = {};

    // Act
    const result = defaultCreateNodeByCode(nodeData);

    // Assert
    expect(result).toEqual({});
  });

  it('should preserve all provided properties', () => {
    // Arrange
    const nodeData: Partial<FgnNodeModel> = {
      id: '1',
      x: 100,
      y: 50,
      width: 200,
      height: 100,
      code: 'B',
      label: 'Node B',
      status: 'active'
    };

    // Act
    const result = defaultCreateNodeByCode(nodeData);

    // Assert
    expect(result).toEqual(nodeData);
  });

  it('should be a pure function', () => {
    // Arrange
    const nodeData: Partial<FgnNodeModel> = { code: 'C' };

    // Act
    const result1 = defaultCreateNodeByCode(nodeData);
    const result2 = defaultCreateNodeByCode(nodeData);

    // Assert
    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2); // Different object references
  });
});
