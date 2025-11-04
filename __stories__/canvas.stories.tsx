import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent, FgnToolbarItem,
    FgnZoomComponent,
    useFgnEventListener,
    CANVAS_EVENTS, FgnNodeAction, getNodeById,
} from '../src';
import type {IconStrategy, StatusStrategy} from '../src';
import {SiApacheflink, SiApachekafka} from "react-icons/si";
import {BsBucket} from "react-icons/bs";
import {TbEdit, TbTrash} from "react-icons/tb";
import {IoRocketSharp} from "react-icons/io5";
import {FaPlay} from "react-icons/fa";

const meta: Meta<typeof FgnDrawCanvasComponent> = {
    title: 'Canvas/Interactive Canvas',
    component: FgnDrawCanvasComponent,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Complete interactive canvas with toolbar and zoom controls. Drag nodes from the toolbar to create them on the canvas, connect nodes by dragging from connection points, and use zoom controls to navigate.',
            },
        },
    },
    argTypes: {},
};

const customNodeActions: FgnNodeAction[] = [
    {
        id: 'Delete',
        label: React.createElement(TbTrash as any),
        async onClick(nodeId: string) {
            const node = await getNodeById(nodeId)
            console.log(node)
        },
        order: 1,
        borderColor: 'red',
        iconColor: 'red',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Edit',
        label: React.createElement(TbEdit as any),
        onClick(nodeId: string) {
            // do nothing
        },
        order: 2,
        borderColor: 'blue',
        iconColor: 'blue',
        backgroundColor: '#ffffff'
    },
    {
        id: 'Deploy',
        label: React.createElement(IoRocketSharp as any),
        onClick(nodeId: string) {
            // do nothing
        },
        order: 3,
        borderColor: 'black',
        iconColor: 'black',
        backgroundColor: '#ffffff'
    }, {
        id: 'Start',
        label: React.createElement(FaPlay as any),
        onClick(nodeId: string) {
            // do nothing
        },
        order: 4,
        borderColor: 'green',
        iconColor: 'green',
        backgroundColor: '#ffffff'
    }
];

export default meta;
type Story = StoryObj<typeof meta>;

// Custom icon strategy using react-icons
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

// Custom status strategy for node lifecycle states
const customStatusStrategy: StatusStrategy = {
    defaultStatus: 'draft',
    getStyle: (status: string) => {
        switch (status) {
            case 'draft':
                return {backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD'};
            case 'ready':
                return {backgroundColor: '#2196F3', textColor: 'white', borderColor: '#1976D2'};
            case 'deploying':
                return {backgroundColor: '#FF9800', textColor: 'white', borderColor: '#F57C00'};
            case 'running':
                return {backgroundColor: '#4CAF50', textColor: 'white', borderColor: '#388E3C'};
            case 'failed':
                return {backgroundColor: '#F44336', textColor: 'white', borderColor: '#D32F2F'};
            case 'paused':
                return {backgroundColor: '#FF5722', textColor: 'white', borderColor: '#E64A19'};
            case 'terminated':
                return {backgroundColor: '#757575', textColor: 'white', borderColor: '#616161'};
            default:
                return {backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD'}; // draft as default
        }
    }
};


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
]

// Component wrapper with event listeners
const CanvasWithListeners: React.FC<{ maxVisibleActions: number }> = (props: { maxVisibleActions: number }) => {
    // Listen to all canvas events and log them
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
            <FgnToolbarComponent items={items} iconStrategy={customIconStrategy}/>
            <FgnDrawCanvasComponent iconStrategy={customIconStrategy}
                                    statusStrategy={customStatusStrategy}
                                    nodeActions={customNodeActions}
                                    maxVisibleActions={props.maxVisibleActions}/>
            <FgnZoomComponent alignment={"center"}/>
        </div>
    );
};

export const Default: Story = {
    render: (args) => <CanvasWithListeners maxVisibleActions={args.maxVisibleActions}/>,
    args: {
        maxVisibleActions: 2
    },
};
