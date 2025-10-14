# fg-next-draw

A powerful and flexible React library for creating interactive node-based diagrams with drag-and-drop functionality. Perfect for building flowcharts, visual programming interfaces, workflow designers, and more.

## Features

- 🎨 **Interactive Canvas** - Drag nodes, create connections, zoom and pan
- 🔌 **Connection System** - Visual connection points with drag-to-connect functionality
- 🛠️ **Customizable Toolbar** - Drag items from toolbar to canvas
- 🔍 **Zoom Controls** - Built-in zoom component with keyboard and mouse support
- 📦 **Event System** - Global event bus for component communication
- 🎯 **TypeScript Support** - Full type definitions included
- 🎨 **Customizable Styling** - CSS-based styling with full control
- ⚡ **Performance Optimized** - Efficient rendering and state management

## Installation

```bash
npm install fg-next-draw
```

### Peer Dependencies

This library requires React 18+ or React 19+:

```bash
npm install react react-dom
```

## Quick Start

```tsx
import React from 'react';
import {
  FgnDrawCanvasComponent,
  FgnToolbarComponent,
  FgnZoomComponent,
  defaultToolbarItems,
  defaultCreateNodeByCode,
  defaultGetStatusStyle,
  defaultGetIconConfig
} from 'fg-next-draw';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Toolbar */}
      <FgnToolbarComponent 
        items={defaultToolbarItems}
      />
      
      {/* Main Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <FgnDrawCanvasComponent
          getNodeDefaults={defaultCreateNodeByCode}
          getStatusStyle={defaultGetStatusStyle}
          getIconConfig={defaultGetIconConfig}
        />
        
        {/* Zoom Controls */}
        <FgnZoomComponent
          minZoom={0.1}
          maxZoom={2.0}
          zoomStep={0.1}
          initialZoom={1.0}
          style={{ position: 'absolute', bottom: 20, right: 20 }}
        />
      </div>
    </div>
  );
}

export default App;
```

## Components

### FgnDrawCanvasComponent

The main canvas component where nodes and connections are rendered.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `getNodeDefaults` | `NodeFactoryFunction` | Yes | Function to create node defaults by code |
| `getStatusStyle` | `(status: string) => FgnNodeStatusStyle` | No | Function to get status badge styling |
| `getIconConfig` | `(code: string) => IconConfig` | No | Function to get icon configuration |
| `shouldShowNodeActions` | `(node: FgnNodeModel) => boolean` | No | Function to determine if actions should be shown |
| `nodeActions` | `FgnNodeAction[]` | No | Default actions for all nodes |
| `getNodeActions` | `(node: FgnNodeModel) => FgnNodeAction[]` | No | Function to get actions per node |
| `defaultNodeSize` | `{width: number, height: number}` | No | Default node dimensions (default: 150x75) |
| `maxVisibleActions` | `number` | No | Max visible action buttons (default: 3) |
| `canvasWidth` | `number` | No | Canvas width (default: 5000) |
| `canvasHeight` | `number` | No | Canvas height (default: 5000) |

### FgnToolbarComponent

Draggable toolbar with node templates.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `FgnToolbarItem[]` | Yes | Toolbar items configuration |
| `className` | `string` | No | Additional CSS classes |
| `style` | `React.CSSProperties` | No | Inline styles |
| `renderCustomItem` | `function` | No | Custom item renderer |

### FgnZoomComponent

Zoom control buttons with percentage display.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `minZoom` | `number` | No | 0.1 | Minimum zoom level |
| `maxZoom` | `number` | No | 2.0 | Maximum zoom level |
| `zoomStep` | `number` | No | 0.1 | Zoom increment/decrement |
| `initialZoom` | `number` | No | 1.0 | Initial zoom level |
| `className` | `string` | No | - | Additional CSS classes |
| `style` | `React.CSSProperties` | No | - | Inline styles |

## Event System

The library uses a global event bus for component communication.

```tsx
import { useEventBus, CANVAS_EVENTS } from 'fg-next-draw';

function MyComponent() {
  const { emit } = useEventBus();
  
  // Emit an event
  const handleAction = () => {
    emit(CANVAS_EVENTS.NODE_UPDATED, nodeData);
  };
  
  // Listen to an event
  useEventListener(CANVAS_EVENTS.NODE_ADDED, (node) => {
    console.log('Node added:', node);
  });
}
```

### Available Events

- `CANVAS_EVENTS.NODE_ADDED`
- `CANVAS_EVENTS.NODE_UPDATED`
- `CANVAS_EVENTS.NODE_REPLACED`
- `CANVAS_EVENTS.NODES_REPLACED`
- `CANVAS_EVENTS.CONNECTION_CREATED`
- `CANVAS_EVENTS.CONNECTION_DELETED`
- `CANVAS_EVENTS.ZOOM_CHANGED`
- `CANVAS_EVENTS.ZOOM_WITH_POINT`
- `CANVAS_EVENTS.ZOOM_RESET`
- `CANVAS_EVENTS.ZOOM_CONFIG_UPDATED`

## Types and Interfaces

### FgnNodeModel

```typescript
interface FgnNodeModel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  code?: string;
  status?: string;
  iconCode?: string;
  leftConnectionPoint: ConnectionPoint;
  rightConnectionPoint: ConnectionPoint;
  connectedTo: string[];
  connectedFrom: string[];
  actions?: FgnNodeAction[];
  bottomLeftLabel: string;
}
```

### FgnNodeAction

```typescript
interface FgnNodeAction {
  id: string;
  label: string;
  onClick: (nodeId: string) => void;
  disabled?: boolean;
  isDisabled?: (node: FgnNodeModel) => boolean;
  className?: string;
}
```

### FgnConnectionModel

```typescript
interface FgnConnectionModel {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}
```

## Factories

The library provides default factory functions:

- `defaultToolbarItems` - Default toolbar configuration
- `defaultNodeActions` - Default node actions
- `defaultGetStatusStyle` - Default status badge styling
- `defaultGetIconConfig` - Default icon configuration
- `defaultCreateNodeByCode` - Default node factory
- `defaultCanvasConfig` - Default canvas configuration

## Utilities

Exported utility functions:

- `generateNodeId()` - Generate unique node IDs
- `generateConnectionId()` - Generate unique connection IDs
- `generateConnectionPath(start, end)` - Generate SVG path for connections
- `calculateConnectionPoints(node)` - Calculate connection point positions
- `calculateNodesCenter(nodes)` - Calculate center point of nodes
- `calculatePathMidpoint(start, end)` - Calculate path midpoint

## Customization

### Custom Node Actions

```tsx
const customActions: FgnNodeAction[] = [
  {
    id: 'delete',
    label: '🗑️',
    onClick: (nodeId) => {
      // Delete node logic
    }
  },
  {
    id: 'edit',
    label: '✏️',
    onClick: (nodeId) => {
      // Edit node logic
    },
    isDisabled: (node) => node.status === 'locked'
  }
];

<FgnDrawCanvasComponent
  nodeActions={customActions}
  // ... other props
/>
```

### Custom Status Styling

```tsx
const getCustomStatusStyle = (status: string): FgnNodeStatusStyle => {
  const styles = {
    'active': { backgroundColor: '#4CAF50', textColor: 'white', borderColor: '#45a049' },
    'error': { backgroundColor: '#f44336', textColor: 'white', borderColor: '#da190b' },
    'pending': { backgroundColor: '#ff9800', textColor: 'white', borderColor: '#e68900' }
  };
  return styles[status] || { backgroundColor: '#9E9E9E', textColor: 'white' };
};

<FgnDrawCanvasComponent
  getStatusStyle={getCustomStatusStyle}
  // ... other props
/>
```

## Canvas Interactions

- **Pan**: Middle mouse button or Shift + Left mouse button
- **Zoom**: Ctrl/Cmd + Mouse wheel
- **Drag Node**: Left mouse button on node
- **Create Connection**: Drag from connection point (green = input, red = output)
- **Delete Connection**: Hover over connection and click delete button

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Repository

[https://github.com/fguaman/fg-next-draw](https://github.com/fguaman/fg-next-draw)

## Issues

Report issues at: [https://github.com/fguaman/fg-next-draw/issues](https://github.com/fguaman/fg-next-draw/issues)

## Publishing to NPM

### First Time Setup

1. Create an account at [npmjs.com](https://www.npmjs.com/)
2. Login via terminal:
   ```bash
   npm login
   ```
3. Verify the package name is available:
   ```bash
   npm view fg-next-draw
   ```

### Publishing

1. Update version in `package.json` (follow [semantic versioning](https://semver.org/)):
   - MAJOR: Breaking changes (1.0.0 → 2.0.0)
   - MINOR: New features, backwards compatible (1.0.0 → 1.1.0)
   - PATCH: Bug fixes (1.0.0 → 1.0.1)

2. Build the library:
   ```bash
   npm run build
   ```

3. Publish to NPM:
   ```bash
   npm publish
   ```

### Update Package

```bash
# Update patch version (1.0.0 → 1.0.1)
npm version patch

# Update minor version (1.0.0 → 1.1.0)
npm version minor

# Update major version (1.0.0 → 2.0.0)
npm version major

# Then publish
npm publish
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
