import React, { useState, useRef } from 'react';
import { FgnNodeModel as NodeType } from '../fg-next-draw-node/model/fgn-node.model';
import FgnNodeComponent from '../fg-next-draw-node/fgn-node.component';
import { useEventBus } from '../../utils/event-system/use-event-bus.hook';
import { CANVAS_EVENTS } from './model/canvas-events.constants';
import { createHandleDrop } from './handler/handle-drop.handler';
import { useNodeDrag } from './handler/use-node-drag.handler';
import { handleDragOver } from './handler/handle-drag-over.handler';
import './fgn-draw-canvas.component.css'

const FgnDrawCanvasComponent: React.FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
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

    // Drop handler
    const handleDrop = createHandleDrop(
        nodes,
        setNodes,
        svgRef,
        emit,
        CANVAS_EVENTS.NODE_ADDED
    );

    return (
        <svg
            className={"fgn-draw-canvas"}
            ref={svgRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {nodes.map(node => (
                <FgnNodeComponent
                    key={node.id}
                    node={node}
                    onMouseDown={handleNodeMouseDown}
                />
            ))}
        </svg>
    );
};

export default FgnDrawCanvasComponent;

