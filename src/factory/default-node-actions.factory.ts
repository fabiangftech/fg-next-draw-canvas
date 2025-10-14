import React from 'react';
import { MdEdit, MdDelete, MdSettings, MdPublic } from 'react-icons/md';
import { FgnNodeAction } from '../components/fg-next-draw-node/model/fgn-node-action.model';

/**
 * Default node actions for the system
 */
export const defaultNodeActions: FgnNodeAction[] = [
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

