import React from "react";
import { FgnNodeModel } from '../../fg-next-node/model/fgn-node.model';

export const createHandleNodeReplaced = (
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>
) => {
  return (updatedNode: FgnNodeModel) => {
    setNodes(prevNodes => {
      const nodeIndex = prevNodes.findIndex(node => node.id === updatedNode.id);
      if (nodeIndex === -1) {
        // Add new node if not found
        return [...prevNodes, updatedNode];
      } else {
        // Replace existing node
        const newNodes = [...prevNodes];
        newNodes[nodeIndex] = updatedNode;
        return newNodes;
      }
    });
  };
};
