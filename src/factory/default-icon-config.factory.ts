import { IconConfig } from '../components/shared/icon-config.service';

/**
 * Default icon configuration function for the system
 */
export const defaultGetIconConfig = (iconCode: string): IconConfig | null => {
  switch (iconCode) {
    case 'node-a':
      return {
        icon: 'A',
        color: '#FF9900',
        label: 'Node A'
      };
    case 'node-b':
      return {
        icon: 'B',
        color: 'purple',
        label: 'Node B'
      };
    case 'node-c':
      return {
        icon: 'C',
        color: '#E6526F',
        label: 'Node C'
      };
    default:
      return {
        icon: 'D',
        color: '#909090',
        label: 'Node X'
      };
  }
};

