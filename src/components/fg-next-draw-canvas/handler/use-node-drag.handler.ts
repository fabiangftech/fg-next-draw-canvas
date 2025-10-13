import React, { useState } from 'react';
import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';

export const useNodeDrag = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  eventName: string
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
    if (draggedNodeId) {
      const updatedNode = nodes.find(node => node.id === draggedNodeId);
      if (updatedNode) {
        emit(eventName, updatedNode);
      }
    }
    setDraggedNodeId(null);
  };

  return {
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};

