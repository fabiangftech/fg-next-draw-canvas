import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent, FgnToolbarItem,
    FgnZoomComponent,
} from '../src';
import type {IconStrategy, StatusStrategy} from '../src';
import {SiApacheflink, SiApachekafka} from "react-icons/si";
import {BsBucket} from "react-icons/bs";

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

export default meta;
type Story = StoryObj<typeof meta>;

// Custom icon strategy using react-icons
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

export const Default: Story = {

    //todo add listeners and print console.log
    render: (args) => (
        <div>
            <FgnToolbarComponent items={items} iconStrategy={customIconStrategy}/>
            <FgnDrawCanvasComponent iconStrategy={customIconStrategy}
                                    statusStrategy={customStatusStrategy}/>
            <FgnZoomComponent/>
        </div>
    ),
    args: {},
};
