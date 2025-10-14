import { FgnToolbarItem } from '../components/fg-next-draw-toolbar/model/fgn-toolbar-item.model';
import { defaultGetIconConfig } from './default-icon-config.factory';

/**
 * Default toolbar items for the system
 */
export const defaultToolbarItems: FgnToolbarItem[] = [
    {
        id: 'node-a',
        iconCode: 'node-a',
        getIconConfig: defaultGetIconConfig
    },
    {
        id: 'node-b',
        iconCode: 'node-b',
        getIconConfig: defaultGetIconConfig
    },
    {
        id: 'node-c',
        iconCode: 'node-c',
        getIconConfig: defaultGetIconConfig
    },
    {
        id: 'node-x',
        iconCode: 'node-x',
        getIconConfig: defaultGetIconConfig
    },
];

