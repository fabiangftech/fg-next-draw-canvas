import React from 'react';
import FgnToolbarComponent from './components/fg-next-draw-toolbar/fgn-toolbar.component';
import FgnDrawCanvasComponent from './components/fg-next-draw-canvas/fgn-draw-canvas.component';
import { FgnToolbarItem } from './components/fg-next-draw-toolbar/model/fgn-toolbar-item.model';

function App() {
    const toolbarItems: FgnToolbarItem[] = [
        {
            id: 'node-basic',
            label: 'Node asd asd',
        },
        {
            id: 'node-advanced',
            label: 'Advanced-hello-world'
        },
    ];

    return (
        <div>
            <FgnDrawCanvasComponent/>
            <FgnToolbarComponent items={toolbarItems}/>
        </div>
    );
}

export default App;
