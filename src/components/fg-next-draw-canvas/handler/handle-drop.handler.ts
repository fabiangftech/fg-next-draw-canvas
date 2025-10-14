import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';
import { generateNodeId } from '../utils/generate-node-id.util';
import { calculateConnectionPoints } from '../utils/calculate-connection-points.util';
import React from "react";
import { SiAmazon, SiApachekafka, SiApacheflink } from 'react-icons/si';

// Create icon components for nodes
const S3Icon = () => React.createElement(SiAmazon as any);
const KafkaIcon = () => React.createElement(SiApachekafka as any);
const FlinkIcon = () => React.createElement(SiApacheflink as any);

// Icon mapping function
const createIconFromType = (iconType: string): React.ReactNode => {
  switch (iconType) {
    case 's3-bucket':
      return React.createElement(S3Icon);
    case 'kafka-topic':
      return React.createElement(KafkaIcon);
    case 'flink-jar':
      return React.createElement(FlinkIcon);
    default:
      return null;
  }
};

export const createHandleDrop = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  svgRef: React.RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  NODE_ADDED_EVENT: string,
  defaultNodeSize: { width: number; height: number } = { width: 150, height: 75 }
) => {
  return (e: React.DragEvent) => {
    e.preventDefault();
    const nodeLabel = e.dataTransfer.getData('nodeLabel');
    const nodeIconType = e.dataTransfer.getData('nodeIconType');
    const nodeColor = e.dataTransfer.getData('nodeColor');
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

      // Create icon if icon type is provided
      const icon = nodeIconType ? createIconFromType(nodeIconType) : null;

      const newNode: FgnNodeModel = {
        id: generateNodeId(),
        x: nodeX,
        y: nodeY,
        width: nodeWidth,
        height: nodeHeight,
        label: nodeLabel,
        status: 'draft',
        icon: icon,
        leftConnectionPoint: connectionPoints.left,
        rightConnectionPoint: connectionPoints.right,
        connectedTo: [],
        connectedFrom: [],
        ...itemData,
      };

      setNodes([...nodes, newNode]);
      
      // Emit event with the newly added node
      emit<FgnNodeModel>(NODE_ADDED_EVENT, newNode);
    }
  };
};

