import { FgnNodeModel } from '../../fg-next-draw-node/model/fgn-node.model';

/**
 * Handler for sorting nodes by their order property
 * Follows Single Responsibility Principle - only handles sorting logic
 */
export class NodeSortHandler {
    private static readonly DEFAULT_ORDER = 0;

    /**
     * Sort nodes by their order property
     * @param nodes Array of nodes to sort
     * @returns Sorted array of nodes
     */
    public static sortNodesByOrder(nodes: FgnNodeModel[]): FgnNodeModel[] {
        return [...nodes].sort((a, b) => {
            const orderA = a.order ?? this.DEFAULT_ORDER;
            const orderB = b.order ?? this.DEFAULT_ORDER;
            return orderA - orderB;
        });
    }

    /**
     * Assign sequential order to nodes based on their current position
     * @param nodes Array of nodes to assign order
     * @returns Array of nodes with assigned order
     */
    public static assignSequentialOrder(nodes: FgnNodeModel[]): FgnNodeModel[] {
        return nodes.map((node, index) => ({
            ...node,
            order: index + 1
        }));
    }

    /**
     * Reorder nodes starting from a specific node
     * @param nodes Array of all nodes
     * @param startNodeId ID of the node to start reordering from
     * @returns Array of nodes with updated order
     */
    public static reorderFromNode(nodes: FgnNodeModel[], startNodeId: string): FgnNodeModel[] {
        const sortedNodes = this.sortNodesByOrder(nodes);
        const startIndex = sortedNodes.findIndex(node => node.id === startNodeId);
        
        if (startIndex === -1) {
            return nodes;
        }

        return sortedNodes.map((node, index) => ({
            ...node,
            order: startIndex + index + 1
        }));
    }
}
