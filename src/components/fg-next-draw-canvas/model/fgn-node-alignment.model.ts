/**
 * Node alignment types for global positioning
 */
export type FgnNodeAlignment = 'left' | 'center' | 'right';

/**
 * Configuration interface for node alignment
 */
export interface FgnNodeAlignmentConfig {
  alignment: FgnNodeAlignment;
  viewportWidth: number;
  viewportHeight: number;
}
