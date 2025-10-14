import { useState, useCallback, RefObject } from 'react';
import { FgnNodeModel, ConnectionPoint } from '../../fg-next-draw-node/model/fgn-node.model';
import { FgnConnectionModel } from '../model/fgn-connection.model';
import { generateConnectionId } from '../../../utils/generate-connection-id.util';

export interface ConnectionPreview {
  start: ConnectionPoint;
  end: ConnectionPoint;
}

export const useConnectionDrag = (
  nodes: FgnNodeModel[],
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  connections: FgnConnectionModel[],
  setConnections: React.Dispatch<React.SetStateAction<FgnConnectionModel[]>>,
  svgRef: RefObject<SVGSVGElement | null>,
  emit: <T>(eventName: string, data: T) => void,
  CONNECTION_CREATED_EVENT: string,
  zoomLevel: number = 1.0,
  panOffset: { x: number, y: number } = { x: 0, y: 0 }
) => {
  const [connectionPreview, setConnectionPreview] = useState<ConnectionPreview | null>(null);
  const [draggingFromNode, setDraggingFromNode] = useState<string | null>(null);

  const handleConnectionPointMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string, pointType: 'left' | 'right') => {
      // Only allow starting connection from right point
      if (pointType !== 'right') {
        return;
      }

      e.stopPropagation();
      
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;

      setDraggingFromNode(nodeId);
      setConnectionPreview({
        start: node.rightConnectionPoint,
        end: node.rightConnectionPoint
      });
    },
    [nodes]
  );

  const handleConnectionMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!connectionPreview || !draggingFromNode || !svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const y = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      setConnectionPreview({
        ...connectionPreview,
        end: { x, y }
      });
    },
    [connectionPreview, draggingFromNode, svgRef, zoomLevel, panOffset]
  );

  const handleConnectionMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingFromNode) return;

      // Check if released on a left connection point
      const target = e.target as SVGElement;
      const targetNodeId = target.getAttribute('data-node-id');
      const targetPointType = target.getAttribute('data-connection-type');

      if (targetNodeId && targetPointType === 'left' && targetNodeId !== draggingFromNode) {
        // Check if connection already exists
        const connectionExists = connections.some(
          conn => conn.sourceNodeId === draggingFromNode && conn.targetNodeId === targetNodeId
        );

        if (!connectionExists) {
          // Create new connection
          const newConnection: FgnConnectionModel = {
            id: generateConnectionId(),
            sourceNodeId: draggingFromNode,
            targetNodeId: targetNodeId
          };

          // Update nodes with connection references
          setNodes(prevNodes =>
            prevNodes.map(node => {
              if (node.id === draggingFromNode) {
                return {
                  ...node,
                  connectedTo: [...node.connectedTo, targetNodeId]
                };
              }
              if (node.id === targetNodeId) {
                return {
                  ...node,
                  connectedFrom: [...node.connectedFrom, draggingFromNode]
                };
              }
              return node;
            })
          );

          setConnections(prev => [...prev, newConnection]);
          emit<FgnConnectionModel>(CONNECTION_CREATED_EVENT, newConnection);
        }
      }

      // Reset preview state
      setConnectionPreview(null);
      setDraggingFromNode(null);
    },
    [draggingFromNode, connections, setNodes, setConnections, emit, CONNECTION_CREATED_EVENT]
  );

  return {
    connectionPreview,
    handleConnectionPointMouseDown,
    handleConnectionMouseMove,
    handleConnectionMouseUp
  };
};

