export const CANVAS_EVENTS = {
  NODE_ADDED: 'node:added',
  NODE_UPDATED: 'node:updated',
  CONNECTION_CREATED: 'connection:created',
  CONNECTION_DELETED: 'connection:deleted',
  NODES_REPLACED: 'nodes:replaced',
  NODE_REPLACED: 'node:replaced',
} as const;

export type CanvasEventType = typeof CANVAS_EVENTS[keyof typeof CANVAS_EVENTS];

