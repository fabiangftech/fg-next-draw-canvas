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
} from 'fg-next-draw';

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