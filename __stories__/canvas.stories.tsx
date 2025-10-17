import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent, FgnToolbarItem,
    FgnZoomComponent,
} from '../src';
import type {IconStrategy} from '../src';
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
const customIconStrategy: IconStrategy = (iconCode?: string) => {
    switch (iconCode) {
        case 's3-bucket':
            return React.createElement(BsBucket as any);
        case 'msk-topic':
            return React.createElement(SiApachekafka as any);
        case 'flink-sql':
            return React.createElement(SiApacheflink as any);
        default:
            return 'unknown';
    }
};


const items: FgnToolbarItem[] = [
    {
        id: 's3-bucket',
        code: 's3-bucket',
        color: '#15ad0b',
        label: 'S3 Bucket'
    },
    {
        id: 'msk-topic',
        code: 'msk-topic',
        color: '#830bc9',
        label: 'MSK Topic'
    },
    {
        id: 'flink-sql',
        code: 'flink-sql',
        color: '#2344f5',
        label: 'Flink SQL'
    }
]

export const Default: Story = {

    render: (args) => (
        <div>
            <FgnToolbarComponent items={items} iconStrategy={customIconStrategy}/>
            <FgnDrawCanvasComponent maxVisibleActions={1}
                                    defaultNodeSize={{width: 180, height: 90}}
                                    iconStrategy={customIconStrategy}/>
            <FgnZoomComponent zoomStep={2.5} maxZoom={10.0}/>
        </div>
    ),
    args: {},
};
