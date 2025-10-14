import React, { useState } from 'react';
import { FgnNodeModel } from './model/fgn-node.model';
import { FgnNodeStatusStyle } from './model/fgn-node-status-style.model';
import { NodeActionGroupingService, FgnNodeActionsGroup } from './model/fgn-node-actions-group.model';
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
  const [showDropdown, setShowDropdown] = useState(false);
  
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

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  const shouldShow = shouldShowActions ? shouldShowActions(node) : true;
  const showActions = shouldShow;
  const hasActions = node.actions && node.actions.length > 0;

  // Group actions for display
  const actionsGroup: FgnNodeActionsGroup = hasActions 
    ? NodeActionGroupingService.groupActions(node.actions!)
    : { visibleActions: [], dropdownActions: [], hasDropdown: false };

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
      {/* Node label with icon */}
      <foreignObject
        x={node.x + 10}
        y={node.y + 5}
        width={node.width - 20}
        height={25}
        style={{ overflow: 'visible', pointerEvents: 'none' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          {node.icon && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                flexShrink: 0,
                pointerEvents: 'none'
              }}
            >
              {node.icon}
            </div>
          )}
          <span
            style={{
              color: '#333',
              fontSize: '14px',
              fontFamily: 'Arial',
              fontWeight: 'normal',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {node.label}
          </span>
        </div>
      </foreignObject>
      
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
            style={{ pointerEvents: 'auto', position: 'relative' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Visible actions */}
            {actionsGroup.visibleActions.map((action) => (
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
            
            {/* Dropdown button */}
            {actionsGroup.hasDropdown && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  className="node-action-button fgn-node-action-dropdown"
                  onClick={handleDropdownToggle}
                  onMouseDown={(e) => e.stopPropagation()}
                  data-tooltip="More actions"
                  title=""
                >
                  ⋮
                </button>
                
                {/* Dropdown menu */}
                {showDropdown && (
                  <div 
                    className="fgn-node-dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      minWidth: '120px'
                    }}
                  >
                    {actionsGroup.dropdownActions.map((action) => (
                      <button
                        key={action.id}
                        className="fgn-node-dropdown-item"
                        onClick={(e) => {
                          handleActionClick(e, action.onClick);
                          setShowDropdown(false);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        disabled={action.disabled}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {action.label} {action.id}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default FgnNodeComponent;

