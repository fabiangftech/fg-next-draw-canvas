import React from "react";
import { FgnConnectionModel } from '../model/fgn-connection.model';

export const createHandleConnectionsReplaced = (
  setConnections: React.Dispatch<React.SetStateAction<FgnConnectionModel[]>>
) => {
  return (newConnections: FgnConnectionModel[]) => {
    setConnections(newConnections);
  };
};
