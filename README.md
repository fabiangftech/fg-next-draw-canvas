# fg-next-draw-canvas

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

## Customization

### Custom Toolbar Items

You can create custom toolbar items by defining an array of `FgnToolbarItem` objects:

```tsx
import { FgnToolbarItem } from 'fg-next-draw-canvas';

const customItems: FgnToolbarItem[] = [
    {
        id: 'database',
        code: 'database-icon', // Used by iconStrategy
        label: 'Database',
        color: '#2196F3',
        tooltip: 'Add a database node'
    },
    {
        id: 'api',
        code: 'api-icon',
        label: 'API Gateway',
        color: '#FF9800',
        tooltip: 'Add an API Gateway node'
    }
];

// Use custom items in toolbar
<FgnToolbarComponent items={customItems} />
```

### Custom Icon Strategy

Create custom icon strategies to use icons from libraries like react-icons:

```tsx
import React from 'react';
import { IconStrategy } from 'fg-next-draw-canvas';
import { BsBucket } from 'react-icons/bs';
import { SiApachekafka, SiApacheflink } from 'react-icons/si';

const customIconStrategy: IconStrategy = {
    useLetters: false, // Use custom icons instead of letters
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

// Apply to toolbar and canvas
<FgnToolbarComponent 
    items={customItems} 
    iconStrategy={customIconStrategy} 
/>
<FgnDrawCanvasComponent iconStrategy={customIconStrategy} />
```

### Custom Status Strategy

Define custom status styles for your nodes:

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

// Apply to canvas
<FgnDrawCanvasComponent statusStrategy={customStatusStrategy} />
```

### Integration with react-icons

Complete example using react-icons for custom icons:

```tsx
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent,
    FgnZoomComponent,
    FgnToolbarItem,
    IconStrategy,
    StatusStrategy
} from 'fg-next-draw-canvas';
import { BsBucket } from 'react-icons/bs';
import { SiApachekafka, SiApacheflink } from 'react-icons/si';

// Install react-icons first
// npm install react-icons

// Custom icon strategy with react-icons
const customIconStrategy: IconStrategy = {
    useLetters: false,
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
                return {backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD'};
            case 'ready':
                return {backgroundColor: '#2196F3', textColor: 'white', borderColor: '#1976D2'};
            case 'running':
                return {backgroundColor: '#4CAF50', textColor: 'white', borderColor: '#388E3C'};
            case 'failed':
                return {backgroundColor: '#F44336', textColor: 'white', borderColor: '#D32F2F'};
            default:
                return {backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD'};
        }
    }
};

// Custom toolbar items
const items: FgnToolbarItem[] = [
    {
        id: 's3-bucket',
        code: 's3-bucket',
        color: '#15ad0b',
        label: 'S3 Bucket'
    },
    {
        id: 'msk-topic',
        code: 'msk-topic',
        color: '#830bc9',
        label: 'MSK Topic'
    },
    {
        id: 'flink-sql',
        code: 'flink-sql',
        color: '#2344f5',
        label: 'Flink SQL'
    }
];

function CustomApp() {
    return (
        <div>
            <FgnToolbarComponent 
                items={items} 
                iconStrategy={customIconStrategy} 
            />
            <FgnDrawCanvasComponent 
                iconStrategy={customIconStrategy}
                statusStrategy={customStatusStrategy}
            />
            <FgnZoomComponent/>
        </div>
    );
}

export default CustomApp;
```