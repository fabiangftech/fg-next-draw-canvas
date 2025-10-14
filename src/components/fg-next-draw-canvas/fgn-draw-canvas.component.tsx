import React, { useState, useRef, useMemo } from 'react';
import { FgnNodeModel as NodeType } from '../fg-next-draw-node/model/fgn-node.model';
import { FgnNodeAction } from '../fg-next-draw-node/model/fgn-node-action.model';
import { FgnNodeStatusStyle } from '../fg-next-draw-node/model/fgn-node-status-style.model';
import { NodeFactoryFunction } from '../fg-next-draw-node/model/fgn-node-factory.model';
import { FgnConnectionModel } from './model/fgn-connection.model';
import FgnNodeComponent from '../fg-next-draw-node/fgn-node.component';
import FgnConnectionComponent from '../fg-next-draw-connection/fgn-connection.component';
import { useEventBus, useEventListener } from '../../utils/event-system/use-event-bus.hook';
import { CANVAS_EVENTS } from './model/canvas-events.constants';
import { createHandleDrop } from './handler/handle-drop.handler';
import { useNodeDrag } from './handler/use-node-drag.handler';
import { useConnectionDrag } from './handler/use-connection-drag.handler';
import { useConnectionDelete } from './handler/handle-connection-delete.handler';
import { handleDragOver } from './handler/handle-drag-over.handler';
import { createHandleNodesReplaced } from './handler/handle-nodes-replaced.handler';
import { createHandleNodeReplaced } from './handler/handle-node-replaced.handler';
import { generateConnectionPath } from './utils/generate-connection-path.util';
import './fgn-draw-canvas.component.css'

interface FgnDrawCanvasProps {
  shouldShowNodeActions?: (node: NodeType) => boolean;
    getNodeDefaults: NodeFactoryFunction;
  nodeActions?: FgnNodeAction[];
  getNodeActions?: (node: NodeType) => FgnNodeAction[];
  getStatusStyle?: (status: string) => FgnNodeStatusStyle;
  getIconConfig?: (code: string) => any;
  defaultNodeSize?: {
    width: number;
    height: number;
  };
  maxVisibleActions?: number;
}

const FgnDrawCanvasComponent: React.FC<FgnDrawCanvasProps> = ({ 
  shouldShowNodeActions,
  nodeActions,
  getNodeActions,
  getStatusStyle,
  getIconConfig,
  defaultNodeSize = { width: 150, height: 75 },
  maxVisibleActions = 3,
  getNodeDefaults
}) => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [connections, setConnections] = useState<FgnConnectionModel[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const { emit } = useEventBus();

    // Node dragging handlers
    const { handleNodeMouseDown, handleMouseMove, handleMouseUp } = useNodeDrag(
        nodes,
        setNodes,
        svgRef,
        emit,
        CANVAS_EVENTS.NODE_UPDATED
    );

    // Connection dragging handlers
    const {
        connectionPreview,
        handleConnectionPointMouseDown,
        handleConnectionMouseMove,
        handleConnectionMouseUp
    } = useConnectionDrag(
        nodes,
        setNodes,
        connections,
        setConnections,
        svgRef,
        emit,
        CANVAS_EVENTS.CONNECTION_CREATED
    );

    // Connection delete handler
    const { handleConnectionDelete } = useConnectionDelete(
        connections,
        setConnections,
        setNodes,
        emit,
        CANVAS_EVENTS.CONNECTION_DELETED
    );

    // Drop handler
    const handleDrop = createHandleDrop(
        nodes,
        setNodes,
        svgRef,
        emit,
        CANVAS_EVENTS.NODE_ADDED,
        defaultNodeSize,
        getNodeDefaults,
        getIconConfig,
    );

    // Combined mouse move handler
    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        handleMouseMove(e);
        handleConnectionMouseMove(e);
    };

    // Combined mouse up handler
    const handleCanvasMouseUp = (e: React.MouseEvent) => {
        handleMouseUp();
        handleConnectionMouseUp(e);
    };

    // Node replacement handlers
    const handleNodesReplaced = createHandleNodesReplaced(setNodes);
    const handleNodeReplaced = createHandleNodeReplaced(setNodes);

    // Listen for nodes replacement events
    useEventListener<NodeType[]>(CANVAS_EVENTS.NODES_REPLACED, handleNodesReplaced);
    useEventListener<NodeType>(CANVAS_EVENTS.NODE_REPLACED, handleNodeReplaced);

    // Compute nodes with actions
    const nodesWithActions = useMemo(() => {
        return nodes.map(node => {
            // If node already has actions, keep them
            if (node.actions && node.actions.length > 0) {
                return node;
            }
            
            // Otherwise, try to get actions from props
            let actions: FgnNodeAction[] | undefined;
            
            if (getNodeActions) {
                actions = getNodeActions(node);
            } else if (nodeActions) {
                actions = nodeActions;
            }
            
            return actions ? { ...node, actions } : node;
        });
    }, [nodes, nodeActions, getNodeActions]);

    return (
        <svg
            className={"fgn-draw-canvas"}
            ref={svgRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
        >
            {/* Render connections first (behind nodes) */}
            {connections.map(connection => {
                const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
                const targetNode = nodes.find(n => n.id === connection.targetNodeId);
                
                if (!sourceNode || !targetNode) return null;
                
                return (
                    <FgnConnectionComponent
                        key={connection.id}
                        connection={connection}
                        sourceNode={sourceNode}
                        targetNode={targetNode}
                        onDelete={handleConnectionDelete}
                    />
                );
            })}

            {/* Render connection preview if dragging */}
            {connectionPreview && (
                <path
                    d={generateConnectionPath(connectionPreview.start, connectionPreview.end)}
                    fill="none"
                    stroke="#4A90E2"
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    pointerEvents="none"
                />
            )}

            {/* Render nodes */}
            {nodesWithActions.map(node => (
                <FgnNodeComponent
                    key={node.id}
                    node={node}
                    onMouseDown={handleNodeMouseDown}
                    onConnectionPointMouseDown={handleConnectionPointMouseDown}
                    shouldShowActions={shouldShowNodeActions}
                    getStatusStyle={getStatusStyle}
                    maxVisibleActions={maxVisibleActions}
                />
            ))}
        </svg>
    );
};

export default FgnDrawCanvasComponent;

