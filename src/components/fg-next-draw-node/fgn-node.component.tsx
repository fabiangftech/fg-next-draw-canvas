import React from 'react';
import { FgnNodeModel } from './model/fgn-node.model';
import './fgn-node.component.css'

interface NodeProps {
  node: FgnNodeModel;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onConnectionPointMouseDown?: (e: React.MouseEvent, nodeId: string, pointType: 'left' | 'right') => void;
  shouldShowActions?: (node: FgnNodeModel) => boolean;
}

const FgnNodeComponent: React.FC<NodeProps> = ({ node, onMouseDown, onConnectionPointMouseDown, shouldShowActions }) => {
  const connectionRadius = 6;
  
  const handleLeftConnectionMouseDown = (e: React.MouseEvent) => {
    if (onConnectionPointMouseDown) {
      e.stopPropagation();
      onConnectionPointMouseDown(e, node.id, 'left');
    }
  };
  
  const handleRightConnectionMouseDown = (e: React.MouseEvent) => {
    if (onConnectionPointMouseDown) {
      e.stopPropagation();
      onConnectionPointMouseDown(e, node.id, 'right');
    }
  };

  const handleActionClick = (e: React.MouseEvent, onClick: (nodeId: string) => void) => {
    e.stopPropagation();
    e.preventDefault();
    onClick(node.id);
  };

  const shouldShow = shouldShowActions ? shouldShowActions(node) : true;
  const showActions = shouldShow;
  const hasActions = node.actions && node.actions.length > 0;

  return (
    <g
      onMouseDown={(e) => onMouseDown(e, node.id)}
      style={{ cursor: 'move' }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        fill="#4A90E2"
        stroke="#2E5C8A"
        strokeWidth={2}
        rx={4}
      />
      <text
        x={node.x + node.width / 2}
        y={node.y + node.height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="14"
        fontFamily="Arial"
        pointerEvents="none"
      >
        {node.label}
      </text>
      
      {/* Left connection point */}
      <circle
        cx={node.leftConnectionPoint.x}
        cy={node.leftConnectionPoint.y}
        r={connectionRadius}
        fill="#2E5C8A"
        stroke="white"
        strokeWidth={2}
        data-node-id={node.id}
        data-connection-type="left"
        onMouseDown={handleLeftConnectionMouseDown}
        style={{ cursor: 'crosshair' }}
      />
      
      {/* Right connection point */}
      <circle
        cx={node.rightConnectionPoint.x}
        cy={node.rightConnectionPoint.y}
        r={connectionRadius}
        fill="#2E5C8A"
        stroke="white"
        strokeWidth={2}
        data-node-id={node.id}
        data-connection-type="right"
        onMouseDown={handleRightConnectionMouseDown}
        style={{ cursor: 'crosshair' }}
      />

      {/* Action buttons */}
      {showActions && hasActions && (
        <foreignObject
          x={node.x + 8}
          y={node.y + node.height - 32}
          width={node.width - 16}
          height="60"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div 
            className="node-actions" 
            style={{ pointerEvents: 'auto' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {node.actions!.map((action) => (
              <button
                key={action.id}
                className={`node-action-button ${action.className || ''}`}
                onClick={(e) => handleActionClick(e, action.onClick)}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={action.disabled}
                data-tooltip={action.id}
                title=""
              >
                {action.label}
              </button>
            ))}
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default FgnNodeComponent;

