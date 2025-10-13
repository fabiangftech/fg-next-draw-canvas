import React from 'react';
import FgnToolbarComponent from './components/fg-next-draw-toolbar/fgn-toolbar.component';
import FgnDrawCanvasComponent from './components/fg-next-draw-canvas/fgn-draw-canvas.component';
import { FgnToolbarItem } from './components/fg-next-draw-toolbar/model/fgn-toolbar-item.model';
import {useEventListener} from "./utils/event-system/use-event-bus.hook";
import {FgnNodeModel} from "./components/fg-next-draw-node/model/fgn-node.model";
import {CANVAS_EVENTS} from "./components/fg-next-draw-canvas/model/canvas-events.constants";

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
    useEventListener<FgnNodeModel>(CANVAS_EVENTS.NODE_ADDED, (node:FgnNodeModel) => {
        console.log('New node added:', node);
    });
    return (
        <div>
            <FgnDrawCanvasComponent/>
            <FgnToolbarComponent items={toolbarItems}/>
        </div>
    );
}

export default App;
