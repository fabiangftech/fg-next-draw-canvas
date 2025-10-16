import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent, FgnToolbarItem,
    FgnZoomComponent,
} from '../src';
import type {IconStrategy} from '../src';
import {SiApacheflink, SiApachekafka, SiClickhouse} from "react-icons/si";
import {PiVault} from "react-icons/pi";
import {BsBucket} from "react-icons/bs";
import {GiAerialSignal, GiKeyLock} from "react-icons/gi";

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
        case 'asm':
            return React.createElement(PiVault as any);
        case 's3-bucket':
            return React.createElement(BsBucket as any);
        case 'msk-topic':
            return React.createElement(SiApachekafka as any);
        case 'flink-jar':
            return React.createElement(SiApacheflink as any);
        case 'flink-sql':
            return React.createElement(SiApacheflink as any);
        case 'clickhouse-table':
            return React.createElement(SiClickhouse as any);
        case 'clickhouse-view':
            return React.createElement(SiClickhouse as any);
        case 'signal-catalog':
            return React.createElement(GiAerialSignal as any);
        case 'kms':
            return React.createElement(GiKeyLock as any);
        default:
            return 'D';
    }
};


const items: FgnToolbarItem[] = [
    {
        id: 'asm',
        code: 'asm',
        color: '#FF9900',
        label: 'Secret Manager'
    } ,{
        id: 'kms',
        code: 'kms',
        color: '#8294f5',
        label: 'Key Manager'
    }, {
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
    }, {
        id: 'flink-jar',
        code: 'flink-jar',
        color: '#e30f40',
        label: 'Flink JAR'
    },
    {
        id: 'flink-sql',
        code: 'flink-sql',
        color: '#2344f5',
        label: 'Flink SQL'
    },
    {
        id: 'clickhouse-table',
        code: 'clickhouse-table',
        color: '#ffc100',
        label: 'Clickhouse Table'
    },
    {
        id: 'clickhouse-view',
        code: 'clickhouse-view',
        color: '#17150f',
        label: 'Clickhouse View'
    }, {
        id: 'signal-catalog',
        code: 'signal-catalog',
        color: '#c862ff',
        label: 'Signal Catalog'
    },
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
