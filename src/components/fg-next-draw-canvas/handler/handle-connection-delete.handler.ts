import { FgnNodeModel } from '../../fg-next-node/model/fgn-node.model';
import { FgnConnectionModel } from '../model/fgn-connection.model';
import React, { useCallback } from 'react';

export const useConnectionDelete = (
  connections: FgnConnectionModel[],
  setConnections: React.Dispatch<React.SetStateAction<FgnConnectionModel[]>>,
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>,
  emit: <T>(eventName: string, data: T) => void,
  CONNECTION_DELETED_EVENT: string
) => {
  const handleConnectionDelete = useCallback((connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    
    if (!connection) return;

    // Update nodes to remove connection references
    setNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.id === connection.sourceNodeId) {
          return {
            ...node,
            connectedTo: node.connectedTo.filter(id => id !== connection.targetNodeId)
          };
        }
        if (node.id === connection.targetNodeId) {
          return {
            ...node,
            connectedFrom: node.connectedFrom.filter(id => id !== connection.sourceNodeId)
          };
        }
        return node;
      })
    );

    // Remove connection
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    
    // Emit event
    emit<FgnConnectionModel>(CONNECTION_DELETED_EVENT, connection);
  }, [connections, setConnections, setNodes, emit, CONNECTION_DELETED_EVENT]);

  return { handleConnectionDelete };
};

