import React from 'react';
import FgnToolbarComponent from './components/fg-next-draw-toolbar/fgn-toolbar.component';
import FgnDrawCanvasComponent from './components/fg-next-draw-canvas/fgn-draw-canvas.component';
import FgnZoomComponent from './components/fg-next-zoom/fgn-zoom.component';
import {useEventListener} from "./utils/event-system/use-event-bus.hook";
import {FgnNodeModel} from "./components/fg-next-draw-node/model/fgn-node.model";
import {CANVAS_EVENTS} from "./components/fg-next-draw-canvas/model/canvas-events.constants";
import {FgnConnectionModel} from "./components/fg-next-draw-canvas/model/fgn-connection.model";
import {
    defaultToolbarItems,
    defaultNodeActions,
    defaultGetStatusStyle,
    defaultGetIconConfig,
    defaultCreateNodeByCode,
    defaultCanvasConfig
} from './factory';
import './App.css'

function App() {
    useEventListener<FgnNodeModel>(CANVAS_EVENTS.NODE_ADDED, (node:FgnNodeModel) => {
        console.log('New node added:', node);
    });
    useEventListener<FgnNodeModel>(CANVAS_EVENTS.NODE_UPDATED, (node:FgnNodeModel) => {
        console.log('Node updated:', node);
    });
    useEventListener<FgnConnectionModel>(CANVAS_EVENTS.CONNECTION_CREATED, (connection) => {
        console.log('Connection created:', connection);
    });
    useEventListener<FgnConnectionModel>(CANVAS_EVENTS.CONNECTION_DELETED, (connection) => {
        console.log('Connection created:', connection);
    });
    return (
        <div>
            <FgnDrawCanvasComponent
                nodeActions={defaultNodeActions}
                getStatusStyle={defaultGetStatusStyle}
                getIconConfig={defaultGetIconConfig}
                defaultNodeSize={defaultCanvasConfig.defaultNodeSize}
                maxVisibleActions={defaultCanvasConfig.maxVisibleActions}
                getNodeDefaults={defaultCreateNodeByCode}
                minZoom={defaultCanvasConfig.zoom.minZoom}
                maxZoom={defaultCanvasConfig.zoom.maxZoom}
                zoomStep={defaultCanvasConfig.zoom.zoomStep}
                initialZoom={defaultCanvasConfig.zoom.initialZoom}
            />
            <FgnToolbarComponent items={defaultToolbarItems}/>
            <FgnZoomComponent
                minZoom={defaultCanvasConfig.zoom.minZoom}
                maxZoom={defaultCanvasConfig.zoom.maxZoom}
                zoomStep={defaultCanvasConfig.zoom.zoomStep}
                initialZoom={defaultCanvasConfig.zoom.initialZoom}
            />
        </div>
    );
}

export default App;
