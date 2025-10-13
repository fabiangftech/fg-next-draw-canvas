export interface ConnectionPoint {
  x: number;
  y: number;
}

export interface FgnNodeModel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  leftConnectionPoint: ConnectionPoint;
  rightConnectionPoint: ConnectionPoint;
  connectedTo: string[];      // IDs of nodes this node connects TO (right -> left)
  connectedFrom: string[];    // IDs of nodes connected TO this node (left <- right)
}

