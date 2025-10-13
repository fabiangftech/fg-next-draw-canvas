import React, { useState, useRef } from 'react';
import { FgnNodeModel as NodeType } from '../fg-next-draw-node/model/fgn-node.model';
import { FgnConnectionModel } from './model/fgn-connection.model';
import FgnNodeComponent from '../fg-next-draw-node/fgn-node.component';
import FgnConnectionComponent from '../fg-next-draw-connection/fgn-connection.component';
import { useEventBus } from '../../utils/event-system/use-event-bus.hook';
import { CANVAS_EVENTS } from './model/canvas-events.constants';
import { createHandleDrop } from './handler/handle-drop.handler';
import { useNodeDrag } from './handler/use-node-drag.handler';
import { useConnectionDrag } from './handler/use-connection-drag.handler';
import { useConnectionDelete } from './handler/handle-connection-delete.handler';
import { handleDragOver } from './handler/handle-drag-over.handler';
import { generateConnectionPath } from './utils/generate-connection-path.util';
import './fgn-draw-canvas.component.css'

const FgnDrawCanvasComponent: React.FC = () => {
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
        CANVAS_EVENTS.NODE_ADDED
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
            {nodes.map(node => (
                <FgnNodeComponent
                    key={node.id}
                    node={node}
                    onMouseDown={handleNodeMouseDown}
                    onConnectionPointMouseDown={handleConnectionPointMouseDown}
                />
            ))}
        </svg>
    );
};

export default FgnDrawCanvasComponent;

