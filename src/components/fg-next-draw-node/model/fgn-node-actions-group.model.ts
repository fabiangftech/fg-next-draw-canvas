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
        // Sort actions by order property (actions without order go to the end)
        const sortedActions = [...actions].sort((a, b) => {
            const orderA = a.order ?? Infinity;
            const orderB = b.order ?? Infinity;
            return orderA - orderB;
        });

        if (sortedActions.length <= config.maxVisibleActions) {
            return {
                visibleActions: sortedActions,
                dropdownActions: [],
                hasDropdown: false
            };
        }

        const visibleActions = sortedActions.slice(0, config.maxVisibleActions);
        const dropdownActions = sortedActions.slice(config.maxVisibleActions);

        return {
            visibleActions,
            dropdownActions,
            hasDropdown: true
        };
    }
}
