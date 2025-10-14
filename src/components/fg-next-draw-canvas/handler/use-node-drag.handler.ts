import React, { useState } from 'react';
import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';
import { calculateConnectionPoints } from '../../../utils/calculate-connection-points.util';

export const useNodeDrag = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  eventName: string,
  zoomLevel: number = 1.0,
  panOffset: { x: number, y: number } = { x: 0, y: 0 }
) => {
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);

    if (node && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

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
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      setNodes(nodes.map(node => {
        if (node.id === draggedNodeId) {
          const newX = mouseX - dragOffset.x;
          const newY = mouseY - dragOffset.y;
          const connectionPoints = calculateConnectionPoints(newX, newY, node.width, node.height);
          
          return {
            ...node,
            x: newX,
            y: newY,
            leftConnectionPoint: connectionPoints.left,
            rightConnectionPoint: connectionPoints.right
          };
        }
        return node;
      }));
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

