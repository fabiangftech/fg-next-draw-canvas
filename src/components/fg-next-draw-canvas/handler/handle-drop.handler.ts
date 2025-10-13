import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';
import { generateNodeId } from '../utils/generate-node-id.util';
import { calculateConnectionPoints } from '../utils/calculate-connection-points.util';
import React from "react";

export const createHandleDrop = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  NODE_ADDED_EVENT: string
) => {
  return (e: React.DragEvent) => {
    e.preventDefault();
    const nodeLabel = e.dataTransfer.getData('nodeLabel');
    const itemDataStr = e.dataTransfer.getData('itemData');

    if (nodeLabel && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let itemData = null;
      try {
        if (itemDataStr) {
          itemData = JSON.parse(itemDataStr);
        }
      } catch (error) {
        console.error('Error parsing itemData:', error);
      }

      const nodeX = x - 50;
      const nodeY = y - 25;
      const nodeWidth = 150;
      const nodeHeight = 75;
      
      const connectionPoints = calculateConnectionPoints(nodeX, nodeY, nodeWidth, nodeHeight);

      const newNode: FgnNodeModel = {
        id: generateNodeId(),
        x: nodeX,
        y: nodeY,
        width: nodeWidth,
        height: nodeHeight,
        label: nodeLabel,
        leftConnectionPoint: connectionPoints.left,
        rightConnectionPoint: connectionPoints.right,
        ...itemData,
      };

      setNodes([...nodes, newNode]);
      
      // Emit event with the newly added node
      emit<FgnNodeModel>(NODE_ADDED_EVENT, newNode);
    }
  };
};

