import { useState } from 'react';
import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';

/**
 * Hook to manage node dragging state and handlers
 */
export const useNodeDrag = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>
) => {
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);

    if (node && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setDraggedNodeId(nodeId);
      setDragOffset({
        x: mouseX - node.x,
        y: mouseY - node.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setNodes(nodes.map(node =>
        node.id === draggedNodeId
          ? { ...node, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  return {
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

