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
        id: '1',
        code: 's3-bucket', // Used by iconStrategy
        label: 'S3 Bucket',
        color: '#2196F3',
        tooltip: 'Add S3 bucket'
    },
    {
        id: '2',
        code: 'msk-topic',
        label: 'MSK Topic',
        color: '#2196F3',
        tooltip: 'Add MSK topic'
    },
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
import { SiApachekafka } from 'react-icons/si';

const customIconStrategy: IconStrategy = {
    useLetters: false, // Use custom icons instead of letters
    getIcon: (code?: string) => {
        switch (code) {
            case 's3-bucket':
                return React.createElement(BsBucket as any);
            case 'msk-topic':
                return React.createElement(SiApachekafka as any);
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

## Component API

### FgnDrawCanvasComponent

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shouldShowNodeActions` | `(node: FgnNodeModel) => boolean` | - | Función que determina si mostrar las acciones de un nodo específico |
| `getNodeDefaults` | `NodeFactoryFunction` | `defaultCreateNodeByCode` | Función para crear nodos por defecto basada en el código |
| `nodeActions` | `FgnNodeAction[]` | `defaultNodeActions` | Array de acciones disponibles para los nodos |
| `getNodeActions` | `(node: FgnNodeModel) => FgnNodeAction[]` | - | Función que retorna las acciones específicas para un nodo |
| `statusStrategy` | `StatusStrategy` | `defaultStatusStrategy` | Estrategia para manejar los estilos de estado de los nodos |
| `iconStrategy` | `IconStrategy` | `defaultIconStrategy` | Estrategia para renderizar iconos en los nodos |
| `nodeSize` | `{ width: number; height: number }` | `{ width: 150, height: 75 }` | Tamaño por defecto de los nodos |
| `maxVisibleActions` | `number` | `3` | Número máximo de acciones visibles en un nodo |
| `canvasWidth` | `number` | `5000` | Ancho del canvas SVG |
| `canvasHeight` | `number` | `5000` | Alto del canvas SVG |

### FgnToolbarComponent

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `FgnToolbarItem[]` | `defaultToolbarItems` | Array de elementos del toolbar |
| `className` | `string` | `''` | Clase CSS adicional para el contenedor del toolbar |
| `style` | `React.CSSProperties` | - | Estilos CSS inline para el contenedor del toolbar |
| `iconStrategy` | `IconStrategy` | `defaultIconStrategy` | Estrategia para renderizar iconos en los elementos del toolbar |
| `renderCustomItem` | `(item: FgnToolbarItem, defaultRenderer: (item: FgnToolbarItem) => React.ReactNode) => React.ReactNode` | - | Función personalizada para renderizar elementos del toolbar |

### FgnZoomComponent

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `className` | `string` | `''` | Clase CSS adicional para el contenedor del zoom |
| `style` | `React.CSSProperties` | - | Estilos CSS inline para el contenedor del zoom |
| `minZoom` | `number` | `0.1` | Nivel mínimo de zoom (10%) |
| `maxZoom` | `number` | `5.0` | Nivel máximo de zoom (500%) |
| `zoomStep` | `number` | `3.5` | Incremento/decremento del zoom para eventos de rueda |
| `initialZoom` | `number` | `1.0` | Nivel inicial de zoom (100%) |