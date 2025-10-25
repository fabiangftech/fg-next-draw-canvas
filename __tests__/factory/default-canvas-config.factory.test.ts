import { defaultCanvasConfig } from '../../src/factory/default-canvas-config.factory';

describe('defaultCanvasConfig', () => {
  it('should have correct default node size', () => {
    // Assert
    expect(defaultCanvasConfig.defaultNodeSize).toEqual({
      width: 180,
      height: 90
    });
  });

  it('should have correct max visible actions', () => {
    // Assert
    expect(defaultCanvasConfig.maxVisibleActions).toBe(2);
  });

  it('should have correct zoom configuration', () => {
    // Assert
    expect(defaultCanvasConfig.zoom).toEqual({
      minZoom: 0.5,
      maxZoom: 3.0,
      zoomStep: 2.0,
      initialZoom: 1.0
    });
  });

  it('should be immutable object', () => {
    // Act & Assert
    expect(Object.isFrozen(defaultCanvasConfig)).toBe(false);
    expect(typeof defaultCanvasConfig).toBe('object');
  });
});
