import {FgnNodeAction} from '../components/fg-next-draw-node/model/fgn-node-action.model';

export const defaultNodeActions: FgnNodeAction[] = [
    {
        id: 'Edit',
        label:'E',
        order: 1,
        onClick: (nodeId: string) => {
            alert(`'Edit node:', ${nodeId}`);
        },
        isDisabled(node ){
            return node.code==='X'
        }
    },
    {
        id: 'Delete',
        label: 'D',
        order: 2,
        onClick: (nodeId: string) => {
            alert(`'Delete node:', ${nodeId}`);
        }
        // isDisabled: (node) => node.status === 'active'
    },
    {
        id: 'Settings',
        label: 'S',
        order: 3,
        onClick: (nodeId: string) => {
            alert(`'Settings node:', ${nodeId}`);
        }
        // isDisabled: (node) => !node.status
    },
];

