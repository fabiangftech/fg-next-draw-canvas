export const CANVAS_EVENTS = {
  NODE_ADDED: 'node:added',
  NODE_UPDATED: 'node:updated',
  CONNECTION_CREATED: 'connection:created',
  CONNECTION_DELETED: 'connection:deleted',
  NODES_REPLACED: 'nodes:replaced',
  NODE_REPLACED: 'node:replaced',
  ZOOM_CHANGED: 'zoom:changed',
  ZOOM_WITH_POINT: 'zoom:with-point',
  ZOOM_RESET: 'zoom:reset',
  ZOOM_CONFIG_UPDATED: 'zoom:config-updated',
  GET_NODE_BY_ID_REQUEST: 'get-node-by-id:request',
  GET_NODE_BY_ID_RESPONSE: 'get-node-by-id:response',
} as const;

export type CanvasEventType = typeof CANVAS_EVENTS[keyof typeof CANVAS_EVENTS];

