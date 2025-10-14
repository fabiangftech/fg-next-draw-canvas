import { FgnNodeStatusStyle } from '../components/fg-next-draw-node/model/fgn-node-status-style.model';

/**
 * Default status style function for the system
 */
export const defaultGetStatusStyle = (status: string): FgnNodeStatusStyle => {
    switch(status) {
        case 'draft': 
            return { backgroundColor: '#E0E0E0', textColor: '#666', borderColor: '#BDBDBD' };
        case 'active': 
            return { backgroundColor: '#4CAF50', textColor: 'white', borderColor: '#388E3C' };
        case 'pending': 
            return { backgroundColor: '#FFC107', textColor: '#333', borderColor: '#F57C00' };
        case 'completed': 
            return { backgroundColor: '#2196F3', textColor: 'white', borderColor: '#1976D2' };
        case 'error': 
            return { backgroundColor: '#F44336', textColor: 'white', borderColor: '#D32F2F' };
        case 'warning': 
            return { backgroundColor: '#FF9800', textColor: 'white', borderColor: '#F57C00' };
        default: 
            return { backgroundColor: '#9E9E9E', textColor: 'white', borderColor: '#757575' };
    }
};

