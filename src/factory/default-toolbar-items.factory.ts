import { FgnToolbarItem } from '../components/fg-next-draw-toolbar/model/fgn-toolbar-item.model';
import { defaultGetIconConfig } from './default-icon-config.factory';

/**
 * Default toolbar items for the system
 */
export const defaultToolbarItems: FgnToolbarItem[] = [
    {
        id: 'node-default',
        iconCode: 'node-default',
        getIconConfig: defaultGetIconConfig
    },
    {
        id: 's3-bucket',
        iconCode: 's3-bucket',
        getIconConfig: defaultGetIconConfig
    },
    {
        id: 'kafka-topic',
        iconCode: 'kafka-topic',
        getIconConfig: defaultGetIconConfig
    },
    {
        id: 'flink-jar',
        iconCode: 'flink-jar',
        getIconConfig: defaultGetIconConfig
    },
];

