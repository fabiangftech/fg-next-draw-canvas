export const CANVAS_EVENTS = {
  NODE_ADDED: 'node:added',
} as const;

export type CanvasEventType = typeof CANVAS_EVENTS[keyof typeof CANVAS_EVENTS];

