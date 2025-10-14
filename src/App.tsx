import React from 'react';
import FgnToolbarComponent from './components/fg-next-draw-toolbar/fgn-toolbar.component';
import FgnDrawCanvasComponent from './components/fg-next-draw-canvas/fgn-draw-canvas.component';
import { FgnToolbarItem } from './components/fg-next-draw-toolbar/model/fgn-toolbar-item.model';
import { FgnNodeAction } from './components/fg-next-draw-node/model/fgn-node-action.model';
import { FgnNodeStatusStyle } from './components/fg-next-draw-node/model/fgn-node-status-style.model';
import {useEventListener} from "./utils/event-system/use-event-bus.hook";
import {FgnNodeModel} from "./components/fg-next-draw-node/model/fgn-node.model";
import {CANVAS_EVENTS} from "./components/fg-next-draw-canvas/model/canvas-events.constants";
import {FgnConnectionModel} from "./components/fg-next-draw-canvas/model/fgn-connection.model";
import { MdEdit, MdDelete, MdSettings, MdPublic } from 'react-icons/md';
import { getIconConfig } from './components/shared/icon-config.service';
import './App.css'
import {createDefaultNodeByCode} from "./components/fg-next-draw-node/model/fgn-node-factory.model";

function App() {
    // Define actions for nodes
    const nodeActions: FgnNodeAction[] = [
        {
            id: 'Edit',
            label: React.createElement(MdEdit as any),
            order: 1,
            onClick: (nodeId: string) => {
                console.log('Edit node:', nodeId);
            }
        },
        {
            id: 'Delete',
            label: React.createElement(MdDelete as any),
            order: 2,
            onClick: (nodeId: string) => {
                console.log('Delete node:', nodeId);
            }
        },
        {
            id: 'Settings',
            label: React.createElement(MdSettings as any),
            order: 3,
            onClick: (nodeId: string) => {
                console.log('Settings for node:', nodeId);
            }
        },
        {
            id: 'Earth',
            label: React.createElement(MdPublic as any),
            order: 4,
            onClick: (nodeId: string) => {
                console.log('Earth action for node:', nodeId);
            }
        },
    ];

    // Define status styles
    const getStatusStyle = (status: string): FgnNodeStatusStyle => {
        switch(status) {
            case 'draft': 
                return { backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD' };
            case 'active': 
                return { backgroundColor: '#4CAF50', textColor: 'white', borderColor: '#388E3C' };
            case 'pending': 
                return { backgroundColor: '#FFC107', textColor: '#333', borderColor: '#F57C00' };
            case 'completed': 
                return { backgroundColor: '#2196F3', textColor: 'white', borderColor: '#1976D2' };
            case 'error': 
                return { backgroundColor: '#F44336', textColor: 'white', borderColor: '#D32F2F' };
            case 'warning': 
                return { backgroundColor: '#FF9800', textColor: 'white', borderColor: '#F57C00' };
            default: 
                return { backgroundColor: '#9E9E9E', textColor: 'white', borderColor: '#757575' };
        }
    };

    const toolbarItems: FgnToolbarItem[] = [
        {
            id: 'node-default',
            iconCode: 'node-default',
            getIconConfig: getIconConfig
        },
        {
            id: 's3-bucket',
            iconCode: 's3-bucket',
            getIconConfig: getIconConfig
        },
        {
            id: 'kafka-topic',
            iconCode: 'kafka-topic',
            getIconConfig: getIconConfig
        },
        {
            id: 'flink-jar',
            iconCode: 'flink-jar',
            getIconConfig: getIconConfig
        },
    ];
    
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
                nodeActions={nodeActions}
                getStatusStyle={getStatusStyle}
                getIconConfig={getIconConfig}
                defaultNodeSize={{ width: 180, height: 90 }}
                maxVisibleActions={2}
                getNodeDefaults={createDefaultNodeByCode}
            />
            <FgnToolbarComponent items={toolbarItems}/>
        </div>
    );
}

export default App;
