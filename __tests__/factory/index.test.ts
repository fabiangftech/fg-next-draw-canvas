import {
  defaultToolbarItems,
  defaultNodeActions,
  defaultCreateNodeByCode,
  defaultCanvasConfig
} from '../../src';

describe('Factory Index', () => {
  it('should export defaultToolbarItems', () => {
    // Assert
    expect(defaultToolbarItems).toBeDefined();
    expect(Array.isArray(defaultToolbarItems)).toBe(true);
    expect(defaultToolbarItems.length).toBeGreaterThan(0);
  });

  it('should export defaultNodeActions', () => {
    // Assert
    expect(defaultNodeActions).toBeDefined();
    expect(Array.isArray(defaultNodeActions)).toBe(true);
    expect(defaultNodeActions.length).toBeGreaterThan(0);
  });

  it('should export defaultCreateNodeByCode', () => {
    // Assert
    expect(defaultCreateNodeByCode).toBeDefined();
    expect(typeof defaultCreateNodeByCode).toBe('function');
  });

  it('should export defaultCanvasConfig', () => {
    // Assert
    expect(defaultCanvasConfig).toBeDefined();
    expect(typeof defaultCanvasConfig).toBe('object');
  });

  it('should have working defaultCreateNodeByCode function', () => {
    // Arrange
    const testData = {
      code: 'TEST',
      status: 'active',
      customProp: 'value'
    };

    // Act
    const result = defaultCreateNodeByCode(testData);

    // Assert
    expect(result).toBeDefined();
    expect(result.code).toBe('TEST');
    expect(result.status).toBe('active');
  });

  it('should have working defaultToolbarItems with expected structure', () => {
    // Assert
    expect(defaultToolbarItems[0]).toHaveProperty('id');
    expect(defaultToolbarItems[0]).toHaveProperty('label');
    expect(defaultToolbarItems[0]).toHaveProperty('code');
    expect(defaultToolbarItems[0]).toHaveProperty('color');
  });

  it('should have working defaultNodeActions with expected structure', () => {
    // Assert
    expect(defaultNodeActions[0]).toHaveProperty('id');
    expect(defaultNodeActions[0]).toHaveProperty('label');
    expect(defaultNodeActions[0]).toHaveProperty('onClick');
    expect(typeof defaultNodeActions[0].onClick).toBe('function');
  });

  it('should have working defaultCanvasConfig with expected structure', () => {
    // Assert
    expect(defaultCanvasConfig).toHaveProperty('defaultNodeSize');
    expect(defaultCanvasConfig).toHaveProperty('maxVisibleActions');
    expect(defaultCanvasConfig).toHaveProperty('zoom');
    expect(typeof defaultCanvasConfig.maxVisibleActions).toBe('number');
    expect(typeof defaultCanvasConfig.defaultNodeSize).toBe('object');
  });
});
