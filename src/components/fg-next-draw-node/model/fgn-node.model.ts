import { FgnNodeAction } from './fgn-node-action.model';
import { IconConfig } from '../../shared/icon-config.service';

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
  status?: string;
  icon?: React.ReactNode; // Fallback for manual icon override
  iconCode?: string; // Primary way to specify icon via service
  getIconConfig?: (code: string) => IconConfig | null;
  leftConnectionPoint: ConnectionPoint;
  rightConnectionPoint: ConnectionPoint;
  connectedTo: string[];
  connectedFrom: string[];
  actions?: FgnNodeAction[];
}

