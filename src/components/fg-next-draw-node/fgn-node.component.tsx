import React from 'react';
import { FgnNodeModel } from './model/fgn-node.model';
import { FgnNodeStatusStyle } from './model/fgn-node-status-style.model';
import './fgn-node.component.css'

interface NodeProps {
  node: FgnNodeModel;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onConnectionPointMouseDown?: (e: React.MouseEvent, nodeId: string, pointType: 'left' | 'right') => void;
  shouldShowActions?: (node: FgnNodeModel) => boolean;
  getStatusStyle?: (status: string) => FgnNodeStatusStyle;
}

const FgnNodeComponent: React.FC<NodeProps> = ({ node, onMouseDown, onConnectionPointMouseDown, shouldShowActions, getStatusStyle }) => {
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

  // Get status style
  const getDefaultStatusStyle = (status: string): FgnNodeStatusStyle => ({
    backgroundColor: '#9E9E9E',
    textColor: 'white',
    borderColor: '#757575'
  });

  const statusStyle = node.status && getStatusStyle 
    ? getStatusStyle(node.status) 
    : node.status 
      ? getDefaultStatusStyle(node.status)
      : null;

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
        fill="white"
        stroke="#ccc"
        strokeWidth={2}
        rx={4}
      />
      <text
        x={node.x + 10}
        y={node.y + 18}
        textAnchor="start"
        dominantBaseline="middle"
        fill="#333"
        fontSize="14"
        fontFamily="Arial"
        pointerEvents="none"
      >
        {node.label}
      </text>
      
      {/* Left connection point (Input) */}
      <circle
        cx={node.leftConnectionPoint.x}
        cy={node.leftConnectionPoint.y}
        r={connectionRadius}
        fill="#4CAF50"
        stroke="white"
        strokeWidth={2}
        data-node-id={node.id}
        data-connection-type="left"
        onMouseDown={handleLeftConnectionMouseDown}
        style={{ cursor: 'crosshair' }}
      />
      
      {/* Right connection point (Output) */}
      <circle
        cx={node.rightConnectionPoint.x}
        cy={node.rightConnectionPoint.y}
        r={connectionRadius}
        fill="#FF5722"
        stroke="white"
        strokeWidth={2}
        data-node-id={node.id}
        data-connection-type="right"
        onMouseDown={handleRightConnectionMouseDown}
        style={{ cursor: 'crosshair' }}
      />

      {/* Status badge */}
      {node.status && statusStyle && (
        <foreignObject
          x={node.x + node.width / 2 - 30}
          y={node.y + node.height / 2 - 12}
          width="60"
          height="24"
          style={{ overflow: 'visible', pointerEvents: 'none' }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: statusStyle.backgroundColor,
              borderColor: statusStyle.borderColor || statusStyle.backgroundColor,
              border: '2px solid',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              color: statusStyle.textColor,
              textTransform: 'uppercase',
              pointerEvents: 'none'
            }}
          >
            {node.status}
          </div>
        </foreignObject>
      )}

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

