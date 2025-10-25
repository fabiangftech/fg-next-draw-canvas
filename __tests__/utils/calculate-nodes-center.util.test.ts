import { calculateNodesCenter } from '../../src/utils/calculate-nodes-center.util';
import { FgnNodeModel } from '../../src/components/fg-next-node/model/fgn-node.model';

describe('calculateNodesCenter', () => {
  it('should return zero center for empty array', () => {
    // Act
    const center = calculateNodesCenter([]);

    // Assert
    expect(center).toEqual({ x: 0, y: 0 });
  });

  it('should calculate center for single node', () => {
    // Arrange
    const nodes: FgnNodeModel[] = [{
      id: '1',
      x: 100,
      y: 50,
      width: 200,
      height: 100,
      code: 'A',
      label: 'Node A'
    }];

    // Act
    const center = calculateNodesCenter(nodes);

    // Assert
    expect(center).toEqual({ x: 200, y: 100 }); // (100+300)/2, (50+150)/2
  });

  it('should calculate center for multiple nodes', () => {
    // Arrange
    const nodes: FgnNodeModel[] = [
      { id: '1', x: 0, y: 0, width: 100, height: 100, code: 'A', label: 'A' },
      { id: '2', x: 200, y: 0, width: 100, height: 100, code: 'B', label: 'B' }
    ];

    // Act
    const center = calculateNodesCenter(nodes);

    // Assert
    expect(center).toEqual({ x: 150, y: 50 }); // (0+300)/2, (0+100)/2
  });

  it('should handle nodes with different sizes', () => {
    // Arrange
    const nodes: FgnNodeModel[] = [
      { id: '1', x: 0, y: 0, width: 50, height: 50, code: 'A', label: 'A' },
      { id: '2', x: 100, y: 100, width: 200, height: 100, code: 'B', label: 'B' }
    ];

    // Act
    const center = calculateNodesCenter(nodes);

    // Assert
    expect(center).toEqual({ x: 150, y: 100 }); // (0+300)/2, (0+200)/2
  });

  it('should handle negative coordinates', () => {
    // Arrange
    const nodes: FgnNodeModel[] = [
      { id: '1', x: -100, y: -50, width: 200, height: 100, code: 'A', label: 'A' }
    ];

    // Act
    const center = calculateNodesCenter(nodes);

    // Assert
    expect(center).toEqual({ x: 0, y: 0 }); // (-100+100)/2, (-50+50)/2
  });
});
