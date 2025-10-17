import { FgnNodeStatusStyle } from '../fg-next-node/model/fgn-node-status-style.model';

/**
 * Strategy function that maps status to style configuration
 * This follows the Strategy pattern, allowing different implementations
 * for different styling approaches
 */
export type StatusStrategy = (status: string) => FgnNodeStatusStyle;
