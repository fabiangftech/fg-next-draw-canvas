import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  canvasWidth?: number;
  canvasHeight?: number;
  minZoom?: number;
  maxZoom?: number;
}

const FgnDrawCanvasComponent: React.FC<FgnDrawCanvasProps> = ({ 
  shouldShowNodeActions,
  nodeActions,
  getNodeActions,
  getStatusStyle,
  getIconConfig,
  defaultNodeSize = { width: 150, height: 75 },
  maxVisibleActions = 3,
  getNodeDefaults,
  canvasWidth = 5000,
  canvasHeight = 5000,
  minZoom = 0.1,
  maxZoom = 2.0
}) => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [connections, setConnections] = useState<FgnConnectionModel[]>([]);
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement | null>(null);
    const { emit } = useEventBus();

    // Node dragging handlers
    const { handleNodeMouseDown, handleMouseMove, handleMouseUp } = useNodeDrag(
        nodes,
        setNodes,
        svgRef,
        emit,
        CANVAS_EVENTS.NODE_UPDATED,
        zoomLevel
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
        CANVAS_EVENTS.CONNECTION_CREATED,
        zoomLevel
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
        zoomLevel
    );

    // Combined mouse move handler
    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
            setLastMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
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
    
    // Listen for zoom changes
    useEventListener<number>(CANVAS_EVENTS.ZOOM_CHANGED, setZoomLevel);
    
    // Listen for zoom with specific point
    useEventListener<{zoom: number, x: number, y: number}>(CANVAS_EVENTS.ZOOM_WITH_POINT, (data) => {
        const { zoom, x, y } = data;
        
        // Calcular punto del mouse en coordenadas SVG antes del zoom
        const pointX = (x - panOffset.x) / zoomLevel;
        const pointY = (y - panOffset.y) / zoomLevel;
        
        // Calcular nuevo pan para mantener el punto fijo
        const newPanX = x - pointX * zoom;
        const newPanY = y - pointY * zoom;
        
        setPanOffset({ x: newPanX, y: newPanY });
        setZoomLevel(zoom);
    });

    // Wheel handler for zoom with Ctrl/Cmd key using native addEventListener
    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;

        const handleWheelEvent = (e: WheelEvent) => {
            // Detect Ctrl+wheel (pinch on touchpad)
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault(); // This works now!
                
                const rect = svgElement.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const zoomDelta = -e.deltaY * 0.005; // Increased sensitivity (5x faster)
                const newZoom = Math.min(Math.max(zoomLevel + zoomDelta, minZoom), maxZoom);
                
                // Calcular punto del mouse en coordenadas SVG antes del zoom
                const pointX = (mouseX - panOffset.x) / zoomLevel;
                const pointY = (mouseY - panOffset.y) / zoomLevel;
                
                // Calcular nuevo pan para mantener el punto fijo
                const newPanX = mouseX - pointX * newZoom;
                const newPanY = mouseY - pointY * newZoom;
                
                setPanOffset({ x: newPanX, y: newPanY });
                setZoomLevel(newZoom);
                emit(CANVAS_EVENTS.ZOOM_CHANGED, newZoom);
            }
        };

        // Register with { passive: false } to allow preventDefault
        svgElement.addEventListener('wheel', handleWheelEvent, { passive: false });

        // Cleanup
        return () => {
            svgElement.removeEventListener('wheel', handleWheelEvent);
        };
    }, [zoomLevel, emit, panOffset, minZoom, maxZoom]);

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
        <div className="fgn-canvas-container">
            <svg
                className="fgn-draw-canvas"
                ref={svgRef}
                width={canvasWidth}
                height={canvasHeight}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
            >
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
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
            </g>
            </svg>
        </div>
    );
};

export default FgnDrawCanvasComponent;

