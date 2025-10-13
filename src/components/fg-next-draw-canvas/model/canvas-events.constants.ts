export const CANVAS_EVENTS = {
  NODE_ADDED: 'node:added',
  NODE_UPDATED: 'node:updated',
} as const;

export type CanvasEventType = typeof CANVAS_EVENTS[keyof typeof CANVAS_EVENTS];

