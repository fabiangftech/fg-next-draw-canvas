import { FgnNodeStatusStyle } from '../fg-next-node/model/fgn-node-status-style.model';

/**
 * Strategy interface that maps status to style configuration and defines default status
 * This follows the Strategy pattern, allowing different implementations
 * for different styling approaches
 */
export interface StatusStrategy {
  getStyle: (status: string) => FgnNodeStatusStyle;
  defaultStatus: string;
}
