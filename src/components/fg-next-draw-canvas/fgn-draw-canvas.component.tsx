import React, {useState, useRef} from 'react';
import {FgnNodeModel as NodeType} from '../fg-next-draw-node/model/fgn-node.model';
import FgnNodeComponent from '../fg-next-draw-node/fgn-node.component';
import { useEventBus } from '../../utils/event-system/use-event-bus.hook';
import { CANVAS_EVENTS } from './model/canvas-events.constants';
import './fgn-draw-canvas.component.css'
const FgnDrawCanvasComponent: React.FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
    const svgRef = useRef<SVGSVGElement>(null);
    const { emit } = useEventBus();

    const generateId = () => `node-${Date.now()}-${Math.random()}`;

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const nodeLabel = e.dataTransfer.getData('nodeLabel');
        const itemDataStr = e.dataTransfer.getData('itemData');

        if (nodeLabel && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            let itemData = null;
            try {
                if (itemDataStr) {
                    itemData = JSON.parse(itemDataStr);
                }
            } catch (error) {
                console.error('Error parsing itemData:', error);
            }

            const newNode: NodeType = {
                id: generateId(),
                x: x - 50,
                y: y - 25,
                width: 100,
                height: 50,
                label: nodeLabel,
                ...itemData,
            };

            setNodes([...nodes, newNode]);
            
            // Emit event with the newly added node
            emit<NodeType>(CANVAS_EVENTS.NODE_ADDED, newNode);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        const node = nodes.find(n => n.id === nodeId);

        if (node && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            setDraggedNodeId(nodeId);
            setDragOffset({
                x: mouseX - node.x,
                y: mouseY - node.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggedNodeId && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            setNodes(nodes.map(node =>
                node.id === draggedNodeId
                    ? {...node, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y}
                    : node
            ));
        }
    };

    const handleMouseUp = () => {
        setDraggedNodeId(null);
    };

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

