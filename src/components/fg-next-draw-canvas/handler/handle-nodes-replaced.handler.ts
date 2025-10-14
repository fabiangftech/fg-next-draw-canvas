import React from "react";
import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';

export const createHandleNodesReplaced = (
  setNodes: React.Dispatch<React.SetStateAction<FgnNodeModel[]>>
) => {
  return (newNodes: FgnNodeModel[]) => {
    setNodes(newNodes);
  };
};
