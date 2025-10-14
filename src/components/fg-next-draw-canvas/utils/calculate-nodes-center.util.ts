import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';

export const calculateNodesCenter = (nodes: FgnNodeModel[]) => {
  if (nodes.length === 0) {
    return { x: 0, y: 0 };
  }

  // Calculate bounding box of all nodes
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  });

  // Calculate center point
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return { x: centerX, y: centerY };
};

