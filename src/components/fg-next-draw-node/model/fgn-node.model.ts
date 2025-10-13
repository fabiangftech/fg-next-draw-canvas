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
}

