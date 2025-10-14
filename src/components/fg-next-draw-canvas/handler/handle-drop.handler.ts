import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';
import { NodeFactoryFunction, createDefaultNodeByCode } from '../../fg-next-draw-node/model/fgn-node-factory.model';
import { generateNodeId } from '../utils/generate-node-id.util';
import { calculateConnectionPoints } from '../utils/calculate-connection-points.util';
import React from "react";

export const createHandleDrop = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  NODE_ADDED_EVENT: string,
  defaultNodeSize: { width: number; height: number } = { width: 150, height: 75 },
  getNodeDefaults: NodeFactoryFunction,
  getIconConfig?: (code: string) => any
) => {
  return (e: React.DragEvent) => {
    e.preventDefault();
    const nodeLabel = e.dataTransfer.getData('nodeLabel');
    const nodeIconCode = e.dataTransfer.getData('nodeIconCode');
    const nodeCode = e.dataTransfer.getData('nodeCode');
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

      const nodeX = x - defaultNodeSize.width / 2;
      const nodeY = y - defaultNodeSize.height / 2;
      const nodeWidth = defaultNodeSize.width;
      const nodeHeight = defaultNodeSize.height;
      
      const connectionPoints = calculateConnectionPoints(nodeX, nodeY, nodeWidth, nodeHeight);

      // Use factory function to get defaults, or use built-in default function
      const factoryFunction = getNodeDefaults || createDefaultNodeByCode;
      const nodeDefaults = factoryFunction(nodeCode || undefined, {
        iconCode: nodeIconCode || undefined,
        getIconConfig: getIconConfig,
        ...itemData,
      });

      const newNode: FgnNodeModel = {
        id: generateNodeId(),
        x: nodeX,
        y: nodeY,
        width: nodeWidth,
        height: nodeHeight,
        label: nodeLabel,
        leftConnectionPoint: connectionPoints.left,
        rightConnectionPoint: connectionPoints.right,
        connectedTo: [],
        connectedFrom: [],
        bottomLeftLabel: '',
        ...nodeDefaults,
      };

      setNodes([...nodes, newNode]);
      
      // Emit event with the newly added node
      emit<FgnNodeModel>(NODE_ADDED_EVENT, newNode);
    }
  };
};

