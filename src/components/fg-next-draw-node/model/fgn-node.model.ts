import { FgnNodeAction } from './fgn-node-action.model';

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
  code?: string;
  status?: string;
  color?: string;
  leftConnectionPoint: ConnectionPoint;
  rightConnectionPoint: ConnectionPoint;
  connectedTo: string[];
  connectedFrom: string[];
  actions?: FgnNodeAction[];
  bottomLeftLabel: string;
}

