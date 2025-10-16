import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {
    FgnDrawCanvasComponent,
    FgnToolbarComponent, FgnToolbarItem,
    FgnZoomComponent, IconConfig,
} from '../src';
import {SiApacheflink, SiApachekafka, SiClickhouse} from "react-icons/si";
import {PiVault} from "react-icons/pi";
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


export const iconConfig = (iconCode: string): IconConfig | null => {
    switch (iconCode) {
        case 'asm':
            return {
                icon: React.createElement(PiVault as any),
                color: '#FF9900',
                label: 'Secret Manager'
            };
        case 's3-bucket':
            return {
                icon: React.createElement(BsBucket as any),
                color: '#15ad0b',
                label: 'S3 Bucket'
            };
        case 'msk-topic':
            return {
                icon: React.createElement(SiApachekafka as any),
                color: '#830bc9',
                label: 'MSK Topic'
            };
        case 'flink-jar':
            return {
                icon: React.createElement(SiApacheflink as any),
                color: '#e30f40',
                label: 'Flink JAR'
            };
        case 'flink-sql':
            return {
                icon: React.createElement(SiApacheflink as any),
                color: '#2344f5',
                label: 'Flink SQL'
            };
        case 'clickhouse-table':
            return {
                icon: React.createElement(SiClickhouse as any),
                color: '#ffc100',
                label: 'Clickhouse Table'
            };
        case 'clickhouse-view':
            return {
                icon: React.createElement(SiClickhouse as any),
                color: '#17150f',
                label: 'Clickhouse View'
            };
        default:
            return {
                icon: 'D',
                color: '#909090',
                label: 'Node X'
            };
    }
};
const items: FgnToolbarItem[] = [
    {
        id: 'asm',
        icon: React.createElement(PiVault as any),
        iconCode: 'asm',
        label: 'S3 Bucket',
        getIconConfig: iconConfig
    }, {
        id: 's3-bucket',
        icon: React.createElement(BsBucket as any),
        iconCode: 's3-bucket',
        getIconConfig: iconConfig
    },
    {
        id: 'msk-topic',
        icon: React.createElement(SiApachekafka as any),
        iconCode: 'msk-topic',
        getIconConfig: iconConfig
    }, {
        id: 'flink-jar',
        icon: React.createElement(SiApacheflink as any),
        iconCode: 'flink-jar',
        getIconConfig: iconConfig
    },
    {
        id: 'flink-sql',
        icon: React.createElement(SiApacheflink as any),
        iconCode: 'flink-sql',
        getIconConfig: iconConfig
    },
    {
        id: 'clickhouse-table',
        icon: React.createElement(SiClickhouse as any),
        iconCode: 'clickhouse-table',
        getIconConfig: iconConfig
    },
    {
        id: 'clickhouse-view',
        icon: React.createElement(SiClickhouse as any),
        iconCode: 'clickhouse-view',
        getIconConfig: iconConfig
    }
]

export const Default: Story = {

    render: (args) => (
        <div>
            <FgnToolbarComponent items={items}/>
            <FgnDrawCanvasComponent getIconConfig={iconConfig} maxVisibleActions={1}/>
            <FgnZoomComponent zoomStep={2.5} maxZoom={10.0}/>
        </div>
    ),
    args: {},
};
