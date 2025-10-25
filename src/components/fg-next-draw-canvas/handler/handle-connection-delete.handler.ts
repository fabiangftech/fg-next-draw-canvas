import { FgnNodeModel } from '../../fg-next-node/model/fgn-node.model';
import { FgnConnectionModel } from '../model/fgn-connection.model';
import React, { useCallback } from 'react';

const updateNodeAfterConnectionDelete = (
  node: FgnNodeModel,
  sourceNodeId: string,
  targetNodeId: string
): FgnNodeModel => {
  if (node.id === sourceNodeId) {
    return {
      ...node,
      connectedTo: node.connectedTo.filter(id => id !== targetNodeId)
    };
  }
  if (node.id === targetNodeId) {
    return {
      ...node,
      connectedFrom: node.connectedFrom.filter(id => id !== sourceNodeId)
    };
  }
  return node;
};

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

    setNodes(prevNodes =>
      prevNodes.map(node => 
        updateNodeAfterConnectionDelete(node, connection.sourceNodeId, connection.targetNodeId)
      )
    );

    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    emit<FgnConnectionModel>(CONNECTION_DELETED_EVENT, connection);
  }, [connections, setConnections, setNodes, emit, CONNECTION_DELETED_EVENT]);

  return { handleConnectionDelete };
};

