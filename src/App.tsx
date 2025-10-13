import React from 'react';
import FgnToolbarComponent from './components/fg-next-draw-toolbar/fgn-toolbar.component';
import FgnDrawCanvasComponent from './components/fg-next-draw-canvas/fgn-draw-canvas.component';

function App() {
    return (
        <div>
            <FgnDrawCanvasComponent/>
            <FgnToolbarComponent/>
        </div>
    );
}

export default App;
