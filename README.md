[![npm version](https://img.shields.io/npm/v/fg-next-draw-canvas.svg)](https://www.npmjs.com/package/fg-next-draw-canvas)
[![npm license](https://img.shields.io/npm/l/fg-next-draw-canvas.svg)](https://github.com/fabiangftech/fg-next-draw-canvas/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dw/fg-next-draw-canvas.svg)](https://www.npmjs.com/package/fg-next-draw-canvas)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=bugs)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=coverage)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fabiangftech_fg-next-draw-canvas&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=fabiangftech_fg-next-draw-canvas)

# fg-next-draw-canvas

A React library for creating interactive node-based diagrams with drag-and-drop functionality, custom icons, status management, and a comprehensive event system.

## Installation

```bash
npm install fg-next-draw-canvas
```

## Quick Start

```tsx
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent,
    FgnZoomComponent,
} from 'fg-next-draw-canvas';

function App() {
    return (
        <div>
            <FgnToolbarComponent/>
            <FgnDrawCanvasComponent/>
            <FgnZoomComponent/>
        </div>
    );
}

export default App;
```

## Component API

### FgnDrawCanvasComponent

Main canvas component for rendering and interacting with nodes.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `iconStrategy` | `IconStrategy` | `defaultIconStrategy` | Strategy for rendering icons in nodes. See [Icon Strategy](#icon-strategy) |
| `statusStrategy` | `StatusStrategy` | `defaultStatusStrategy` | Strategy for managing node status styles. See [Status Strategy](#status-strategy) |
| `nodeActions` | `FgnNodeAction[]` | `defaultNodeActions` | Array of actions available for nodes. See [Node Actions](#node-actions) |
| `maxVisibleActions` | `number` | `3` | Maximum number of actions visible in a node before grouping |

#### Icon Strategy

The `iconStrategy` prop allows you to customize how icons are rendered in nodes. You can use icons from libraries like `react-icons`:

```tsx
import { IconStrategy } from 'fg-next-draw-canvas';
import { BsBucket } from 'react-icons/bs';
import { SiApachekafka } from 'react-icons/si';
import { SiApacheflink } from 'react-icons/si';

const customIconStrategy: IconStrategy = {
    getIcon: (code?: string) => {
        switch (code) {
            case 's3-bucket':
                return React.createElement(BsBucket as any);
            case 'msk-topic':
                return React.createElement(SiApachekafka as any);
            case 'flink-sql':
                return React.createElement(SiApacheflink as any);
            default:
                return undefined;
        }
    }
};

<FgnDrawCanvasComponent iconStrategy={customIconStrategy} />
```

#### Status Strategy

The `statusStrategy` prop defines custom status styles for your nodes:

```tsx
import { StatusStrategy } from 'fg-next-draw-canvas';

const customStatusStrategy: StatusStrategy = {
    defaultStatus: 'draft',
    getStyle: (status: string) => {
        switch (status) {
            case 'draft':
                return {
                    backgroundColor: '#E0E0E0',
                    textColor: '#666',
                    borderColor: '#BDBDBD'
                };
            case 'ready':
                return {
                    backgroundColor: '#2196F3',
                    textColor: 'white',
                    borderColor: '#1976D2'
                };
            case 'deploying':
                return {
                    backgroundColor: '#FF9800',
                    textColor: 'white',
                    borderColor: '#F57C00'
                };
            case 'running':
                return {
                    backgroundColor: '#4CAF50',
                    textColor: 'white',
                    borderColor: '#388E3C'
                };
            case 'failed':
                return {
                    backgroundColor: '#F44336',
                    textColor: 'white',
                    borderColor: '#D32F2F'
                };
            default:
                return {
                    backgroundColor: '#E0E0E0',
                    textColor: '#666',
                    borderColor: '#BDBDBD'
                };
        }
    }
};

<FgnDrawCanvasComponent statusStrategy={customStatusStrategy} />
```

#### Node Actions

The `nodeActions` prop allows you to define custom actions that appear on nodes:

```tsx
import { FgnNodeAction } from 'fg-next-draw-canvas';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { IoRocketSharp } from 'react-icons/io5';
import { FaPlay } from 'react-icons/fa';

const customNodeActions: FgnNodeAction[] = [
    {
        id: 'Delete',
        label: React.createElement(TbTrash as any),
        onClick: (nodeId: string) => {
            console.log('Delete node:', nodeId);
        },
        order: 1,
        borderColor: 'red',
        iconColor: 'red',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Edit',
        label: React.createElement(TbEdit as any),
        onClick: (nodeId: string) => {
            console.log('Edit node:', nodeId);
        },
        order: 2,
        borderColor: 'blue',
        iconColor: 'blue',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Deploy',
        label: React.createElement(IoRocketSharp as any),
        onClick: (nodeId: string) => {
            console.log('Deploy node:', nodeId);
        },
        order: 3,
        borderColor: 'black',
        iconColor: 'black',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Start',
        label: React.createElement(FaPlay as any),
        onClick: (nodeId: string) => {
            console.log('Start node:', nodeId);
        },
        order: 4,
        borderColor: 'green',
        iconColor: 'green',
        backgroundColor: '#ffffff'
    }
];

<FgnDrawCanvasComponent 
    nodeActions={customNodeActions}
    maxVisibleActions={2}
/>
```

**FgnNodeAction Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the action |
| `label` | `string \| React.ReactElement` | The label or icon to display |
| `onClick` | `(nodeId: string) => void` | Callback function when action is clicked |
| `order` | `number` | Order in which actions are displayed |
| `borderColor` | `string` | Border color of the action button |
| `iconColor` | `string` | Color of the icon/label |
| `backgroundColor` | `string` | Background color of the action button |
| `className` | `string` | Optional CSS class |
| `disabled` | `boolean` | Whether the action is disabled |
| `isDisabled` | `(node: FgnNodeModel) => boolean` | Function to determine if action is disabled based on node |

### FgnToolbarComponent

Toolbar component for dragging nodes onto the canvas.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `FgnToolbarItem[]` | `defaultToolbarItems` | Array of toolbar items |
| `iconStrategy` | `IconStrategy` | `defaultIconStrategy` | Strategy for rendering icons in toolbar items |

#### Toolbar Items

```tsx
import { FgnToolbarItem } from 'fg-next-draw-canvas';

const items: FgnToolbarItem[] = [
    {
        id: '1',
        code: 's3-bucket',
        color: '#15ad0b',
        label: 'S3 Bucket',
        tooltip: 'Add S3 bucket'
    },
    {
        id: '2',
        code: 'msk-topic',
        color: '#830bc9',
        label: 'MSK Topic',
        tooltip: 'Add MSK topic'
    },
    {
        id: '3',
        code: 'flink-sql',
        color: '#2344f5',
        label: 'Flink SQL',
        tooltip: 'Add Flink SQL job'
    }
];

<FgnToolbarComponent 
    items={items} 
    iconStrategy={customIconStrategy}
/>
```

**FgnToolbarItem Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the toolbar item |
| `code` | `string` | Code used by iconStrategy to determine which icon to render |
| `label` | `string` | Display label for the item |
| `color` | `string` | Background color of the toolbar item |
| `tooltip` | `string` | Tooltip text shown on hover |
| `component` | `React.ComponentType<FgnToolbarItemProps>` | Optional custom component to render the item |
| `onDragStart` | `(e: React.DragEvent, item: FgnToolbarItem) => void` | Optional callback when drag starts |
| `onClick` | `(item: FgnToolbarItem) => void` | Optional callback when item is clicked |
| `className` | `string` | Optional CSS class |

### FgnZoomComponent

Zoom control component for the canvas.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `alignment` | `'left' \| 'center' \| 'right'` | `'right'` | Horizontal alignment of the zoom controls |

```tsx
<FgnZoomComponent alignment="center" />
```

## Event System

The library provides a comprehensive event system using the `useFgnEventListener` hook and `CANVAS_EVENTS` constants. This allows you to listen to canvas operations and react to changes.

### Basic Usage

```tsx
import { useFgnEventListener, CANVAS_EVENTS } from 'fg-next-draw-canvas';

function MyComponent() {
    useFgnEventListener(CANVAS_EVENTS.NODE_ADDED, (data) => {
        console.log('Node added:', data);
    });

    return <div>...</div>;
}
```

### Available Events

#### NODE_ADDED

Emitted when a new node is added to the canvas.

**Event Data:** `FgnNodeModel`

```tsx
useFgnEventListener(CANVAS_EVENTS.NODE_ADDED, (node) => {
    console.log('Node added:', node);
    // node.id, node.label, node.x, node.y, etc.
});
```

**FgnNodeModel Structure:**
- `id`: string - Unique node identifier
- `x`: number - X position on canvas
- `y`: number - Y position on canvas
- `width`: number - Node width
- `height`: number - Node height
- `label`: string - Node label
- `code`: string - Icon code for iconStrategy
- `color`: string - Node background color
- `status`: string - Node status
- `leftConnectionPoint`: ConnectionPoint - Left connection point coordinates
- `rightConnectionPoint`: ConnectionPoint - Right connection point coordinates
- `connectedTo`: string[] - Array of node IDs this node connects to
- `connectedFrom`: string[] - Array of node IDs that connect to this node
- `properties`: Record<string, any> - Custom properties

#### NODE_UPDATED

Emitted when a node's position or properties are updated (e.g., after dragging).

**Event Data:** `FgnNodeModel`

```tsx
useFgnEventListener(CANVAS_EVENTS.NODE_UPDATED, (node) => {
    console.log('Node updated:', node);
    // Update your state or sync with backend
});
```

#### CONNECTION_CREATED

Emitted when a connection is created between two nodes.

**Event Data:** `FgnConnectionModel`

```tsx
useFgnEventListener(CANVAS_EVENTS.CONNECTION_CREATED, (connection) => {
    console.log('Connection created:', connection);
    // connection.id, connection.sourceNodeId, connection.targetNodeId
});
```

**FgnConnectionModel Structure:**
- `id`: string - Unique connection identifier
- `sourceNodeId`: string - ID of the source node (where connection starts)
- `targetNodeId`: string - ID of the target node (where connection ends)

#### CONNECTION_DELETED

Emitted when a connection is deleted from the canvas.

**Event Data:** `FgnConnectionModel`

```tsx
useFgnEventListener(CANVAS_EVENTS.CONNECTION_DELETED, (connection) => {
    console.log('Connection deleted:', connection);
});
```

#### NODES_REPLACED

Emitted when all nodes on the canvas are replaced with a new set.

**Event Data:** `FgnNodeModel[]`

```tsx
useFgnEventListener(CANVAS_EVENTS.NODES_REPLACED, (nodes) => {
    console.log('All nodes replaced:', nodes);
    // Array of all nodes on the canvas
});
```

#### NODE_REPLACED

Emitted when a single node is replaced with a new version.

**Event Data:** `FgnNodeModel`

```tsx
useFgnEventListener(CANVAS_EVENTS.NODE_REPLACED, (node) => {
    console.log('Node replaced:', node);
});
```

### Getting a Node by ID

The `getNodeById` utility function allows you to retrieve a node from the canvas by its ID using the event system. This is useful when you need to access node information from outside the canvas component or when working with asynchronous operations.

**How it works:**
- The function emits a `GET_NODE_BY_ID_REQUEST` event with the node ID
- The canvas component listens to this event and responds with `GET_NODE_BY_ID_RESPONSE`
- Returns a Promise that resolves to the node if found, or `null` if not found
- Includes a 5-second timeout to prevent hanging promises

**Usage:**

```tsx
import { getNodeById } from 'fg-next-draw-canvas';

// In an async function or component
const handleGetNode = async (nodeId: string) => {
    try {
        const node = await getNodeById(nodeId);
        if (node) {
            console.log('Node found:', node);
            console.log('Node label:', node.label);
            console.log('Node position:', node.x, node.y);
            // Use the node data as needed
        } else {
            console.log('Node not found');
        }
    } catch (error) {
        console.error('Error getting node:', error);
        // Timeout or other error occurred
    }
};

// Example: Get node information when a button is clicked
function MyComponent() {
    const handleButtonClick = async () => {
        const node = await getNodeById('some-node-id');
        if (node) {
            // Update node or perform operations
            console.log('Retrieved node:', node);
        }
    };

    return <button onClick={handleButtonClick}>Get Node</button>;
}
```

**Use cases:**
- Retrieving node properties when you only have the node ID
- Validating node existence before performing operations
- Accessing node data from external components or utilities
- Synchronizing node data with external state or APIs

**Note:** This function requires the canvas component to be mounted and listening for `GET_NODE_BY_ID_REQUEST` events. The canvas component automatically handles this internally.

### Complete Example

```tsx
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent,
    FgnZoomComponent,
    useFgnEventListener,
    CANVAS_EVENTS,
    FgnToolbarItem,
    FgnNodeAction,
} from 'fg-next-draw-canvas';
import type { IconStrategy, StatusStrategy } from 'fg-next-draw-canvas';
import { SiApacheflink, SiApachekafka } from 'react-icons/si';
import { BsBucket } from 'react-icons/bs';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { IoRocketSharp } from 'react-icons/io5';
import { FaPlay } from 'react-icons/fa';

// Custom icon strategy
const customIconStrategy: IconStrategy = {
    getIcon: (code?: string) => {
        switch (code) {
            case 's3-bucket':
                return React.createElement(BsBucket as any);
            case 'msk-topic':
                return React.createElement(SiApachekafka as any);
            case 'flink-sql':
                return React.createElement(SiApacheflink as any);
            default:
                return undefined;
        }
    }
};

// Custom status strategy
const customStatusStrategy: StatusStrategy = {
    defaultStatus: 'draft',
    getStyle: (status: string) => {
        switch (status) {
            case 'draft':
                return { backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD' };
            case 'ready':
                return { backgroundColor: '#2196F3', textColor: 'white', borderColor: '#1976D2' };
            case 'deploying':
                return { backgroundColor: '#FF9800', textColor: 'white', borderColor: '#F57C00' };
            case 'running':
                return { backgroundColor: '#4CAF50', textColor: 'white', borderColor: '#388E3C' };
            case 'failed':
                return { backgroundColor: '#F44336', textColor: 'white', borderColor: '#D32F2F' };
            default:
                return { backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD' };
        }
    }
};

// Custom node actions
const customNodeActions: FgnNodeAction[] = [
    {
        id: 'Delete',
        label: React.createElement(TbTrash as any),
        onClick: (nodeId: string) => {
            console.log('Delete node:', nodeId);
        },
        order: 1,
        borderColor: 'red',
        iconColor: 'red',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Edit',
        label: React.createElement(TbEdit as any),
        onClick: (nodeId: string) => {
            console.log('Edit node:', nodeId);
        },
        order: 2,
        borderColor: 'blue',
        iconColor: 'blue',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Deploy',
        label: React.createElement(IoRocketSharp as any),
        onClick: (nodeId: string) => {
            console.log('Deploy node:', nodeId);
        },
        order: 3,
        borderColor: 'black',
        iconColor: 'black',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Start',
        label: React.createElement(FaPlay as any),
        onClick: (nodeId: string) => {
            console.log('Start node:', nodeId);
        },
        order: 4,
        borderColor: 'green',
        iconColor: 'green',
        backgroundColor: '#ffffff'
    }
];

// Toolbar items
const items: FgnToolbarItem[] = [
    {
        id: '1',
        code: 's3-bucket',
        color: '#15ad0b',
        label: 'S3 Bucket'
    },
    {
        id: '2',
        code: 'msk-topic',
        color: '#830bc9',
        label: 'MSK Topic'
    },
    {
        id: '3',
        code: 'flink-sql',
        color: '#2344f5',
        label: 'Flink SQL'
    }
];

// Component with event listeners
const CanvasWithListeners: React.FC = () => {
    // Listen to all canvas events
    useFgnEventListener(CANVAS_EVENTS.NODE_ADDED, (data) => {
        console.log(`[${new Date().toISOString()}] NODE_ADDED:`, data);
    });

    useFgnEventListener(CANVAS_EVENTS.NODE_UPDATED, (data) => {
        console.log(`[${new Date().toISOString()}] NODE_UPDATED:`, data);
    });

    useFgnEventListener(CANVAS_EVENTS.CONNECTION_CREATED, (data) => {
        console.log(`[${new Date().toISOString()}] CONNECTION_CREATED:`, data);
    });

    useFgnEventListener(CANVAS_EVENTS.CONNECTION_DELETED, (data) => {
        console.log(`[${new Date().toISOString()}] CONNECTION_DELETED:`, data);
    });

    useFgnEventListener(CANVAS_EVENTS.NODES_REPLACED, (data) => {
        console.log(`[${new Date().toISOString()}] NODES_REPLACED:`, data);
    });

    useFgnEventListener(CANVAS_EVENTS.NODE_REPLACED, (data) => {
        console.log(`[${new Date().toISOString()}] NODE_REPLACED:`, data);
    });

    return (
        <div>
            <FgnToolbarComponent 
                items={items} 
                iconStrategy={customIconStrategy}
            />
            <FgnDrawCanvasComponent 
                iconStrategy={customIconStrategy}
                statusStrategy={customStatusStrategy}
                nodeActions={customNodeActions}
                maxVisibleActions={2}
            />
            <FgnZoomComponent alignment="center" />
        </div>
    );
};

export default CanvasWithListeners;
```