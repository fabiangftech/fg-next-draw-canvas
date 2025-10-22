/**
 * fg-next-draw-canvas - A React library for creating interactive node-based diagrams
 * 
 * @packageDocumentation
 */

// Main Components
export { default as FgnDrawCanvasComponent } from './components/fg-next-draw-canvas/fgn-draw-canvas.component';
export { default as FgnNodeComponent } from './components/fg-next-node/fgn-node.component';
export { default as FgnConnectionComponent } from './components/fg-next-connection/fgn-connection.component';
export { default as FgnToolbarComponent } from './components/fg-next-toolbar/fgn-toolbar.component';
export { default as FgnZoomComponent } from './components/fg-next-zoom/fgn-zoom.component';

// Models and Types - Node
export type { FgnNodeModel } from './components/fg-next-node/model/fgn-node.model';
export type { FgnNodeAction } from './components/fg-next-node/model/fgn-node-action.model';
export type { FgnNodeActionsGroup } from './components/fg-next-node/model/fgn-node-actions-group.model';
export { NodeActionGroupingService } from './components/fg-next-node/model/fgn-node-actions-group.model';
export type { NodeFactoryFunction } from './components/fg-next-node/model/fgn-node-factory.model';
export type { FgnNodeStatusStyle } from './components/fg-next-node/model/fgn-node-status-style.model';

// Models and Types - Connection
export type { FgnConnectionModel } from './components/fg-next-draw-canvas/model/fgn-connection.model';

// Models and Types - Toolbar
export type { FgnToolbarItem, FgnToolbarProps } from './components/fg-next-toolbar/model/fgn-toolbar-item.model';

// Constants
export { CANVAS_EVENTS } from './components/fg-next-draw-canvas/model/canvas-events.constants';

// Event System
export { useFgnEventBus, useFgnEventListener } from './utils/fg-next-event-system/fgn-use-event-bus.hook';
export type { FgnEventListener, FgnEventSubscription, IFgnEventBus } from './utils/fg-next-event-system/fgn-event-bus.types';

// Utilities
export { generateNodeId } from './utils/generate-node-id.util';
export { generateConnectionId } from './utils/generate-connection-id.util';
export { generateConnectionPath } from './utils/generate-connection-path.util';
export { calculateConnectionPoints } from './utils/calculate-connection-points.util';
export { calculateNodesCenter } from './utils/calculate-nodes-center.util';
export { calculatePathMidpoint } from './utils/calculate-path-midpoint.util';
export { getNodeById } from './utils/get-node-by-id.util';

// Factories
export { defaultToolbarItems } from './factory/default-toolbar-items.factory';
export { defaultNodeActions } from './factory/default-node-actions.factory';
export { defaultStatusStrategy } from './strategy/impl/default-status.strategy';
export { defaultIconStrategy } from './strategy/impl/default-icon.strategy';
export { defaultCreateNodeByCode } from './factory/default-node-factory.factory';
export { defaultCanvasConfig } from './factory/default-canvas-config.factory';

// Types from Services
export type { IconStrategy } from './strategy/icon.strategy';
export type { StatusStrategy } from './strategy/status.strategy';

