/**
 * Canvas Event Constants
 * Defines all events emitted by the canvas component
 */

export const CANVAS_EVENTS = {
  /**
   * Emitted when a new node is added to the canvas
   * Payload: FgnNodeModel - The newly added node
   */
  NODE_ADDED: 'node:added',
} as const;

export type CanvasEventType = typeof CANVAS_EVENTS[keyof typeof CANVAS_EVENTS];

