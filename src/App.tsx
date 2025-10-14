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
import './App.css'
const EditIcon = () => React.createElement(MdEdit as any);
const DeleteIcon = () => React.createElement(MdDelete as any);
const SettingsIcon = () => React.createElement(MdSettings as any);
const PublicIcon = () => React.createElement(MdPublic as any);

function App() {
    // Define actions for nodes
    const nodeActions: FgnNodeAction[] = [
        {
            id: 'Edit',
            label: <EditIcon />,
            order: 1,
            onClick: (nodeId: string) => {
                console.log('Edit node:', nodeId);
            }
        },
        {
            id: 'Delete',
            label: <DeleteIcon />,
            order: 2,
            onClick: (nodeId: string) => {
                console.log('Delete node:', nodeId);
            }
        },
        {
            id: 'Settings',
            label: <SettingsIcon />,
            order: 3,
            onClick: (nodeId: string) => {
                console.log('Settings for node:', nodeId);
            }
        },
        {
            id: 'Earth',
            label: <PublicIcon />,
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
            id: 'node-basic',
            label: 'Node A',
        },
        {
            id: 'node-advanced',
            label: 'Node B'
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
                defaultNodeSize={{ width: 180, height: 90 }}
            />
            <FgnToolbarComponent items={toolbarItems}/>
        </div>
    );
}

export default App;
