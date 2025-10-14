import { FgnNodeAction } from './fgn-node-action.model';

/**
 * Interface for grouped node actions
 * Follows Interface Segregation Principle - specific interface for grouped actions
 */
export interface FgnNodeActionsGroup {
    visibleActions: FgnNodeAction[];
    dropdownActions: FgnNodeAction[];
    hasDropdown: boolean;
}

/**
 * Configuration for action grouping
 */
export interface ActionGroupingConfig {
    maxVisibleActions: number;
    dropdownLabel: string;
}

/**
 * Default configuration for action grouping
 */
export const DEFAULT_ACTION_GROUPING_CONFIG: ActionGroupingConfig = {
    maxVisibleActions: 3,
    dropdownLabel: '⋮'
};

/**
 * Service class for managing node action grouping
 * Follows Single Responsibility Principle - only handles action grouping logic
 */
export class NodeActionGroupingService {
    
    /**
     * Group actions based on visibility limit
     * @param actions Array of actions to group
     * @param config Configuration for grouping
     * @returns Grouped actions with visible and dropdown actions
     */
    public static groupActions(
        actions: FgnNodeAction[], 
        config: ActionGroupingConfig = DEFAULT_ACTION_GROUPING_CONFIG
    ): FgnNodeActionsGroup {
        if (actions.length <= config.maxVisibleActions) {
            return {
                visibleActions: actions,
                dropdownActions: [],
                hasDropdown: false
            };
        }

        const visibleActions = actions.slice(0, config.maxVisibleActions);
        const dropdownActions = actions.slice(config.maxVisibleActions);

        return {
            visibleActions,
            dropdownActions,
            hasDropdown: true
        };
    }
}
