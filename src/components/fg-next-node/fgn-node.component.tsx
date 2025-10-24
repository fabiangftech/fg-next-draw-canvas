import React, { useState } from 'react';
import { FgnNodeModel } from './model/fgn-node.model';
import { FgnNodeAction } from './model/fgn-node-action.model';
import { NodeActionGroupingService, FgnNodeActionsGroup } from './model/fgn-node-actions-group.model';
import { IconStrategy } from '../../strategy/icon.strategy';
import { StatusStrategy } from '../../strategy/status.strategy';
import './fgn-node.component.css'
import {defaultStatusStrategy} from "../../strategy/impl/default-status.strategy";

interface NodeProps {
  node: FgnNodeModel;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
  onConnectionPointMouseDown?: (e: React.MouseEvent, nodeId: string, pointType: 'left' | 'right') => void;
  shouldShowActions?: (node: FgnNodeModel) => boolean;
  statusStrategy?: StatusStrategy;
  iconStrategy?: IconStrategy;
  maxVisibleActions?: number;
}

const FgnNodeComponent: React.FC<NodeProps> = ({ node, onMouseDown, onConnectionPointMouseDown, shouldShowActions, statusStrategy, iconStrategy, maxVisibleActions = 3 }) => {
  const connectionRadius = 6;
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Helper function to evaluate if action is disabled
  const isActionDisabled = (action: FgnNodeAction): boolean => {
    if (action.isDisabled) {
      return action.isDisabled(node);
    }
    return action.disabled ?? false;
  };
  
  // Get icon from iconStrategy
  const iconToRender = iconStrategy ? iconStrategy.getIcon(node.code) : null;
  
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
    ? NodeActionGroupingService.groupActions(node.actions!, { maxVisibleActions, dropdownLabel: '⋮' })
    : { visibleActions: [], dropdownActions: [], hasDropdown: false };

  // Get status style
  const statusStyle = node.status && statusStrategy 
    ? statusStrategy.getStyle(node.status) 
    : node.status 
      ? defaultStatusStrategy.getStyle(node.status)
      : null;

  return (
    <g
      className="fgn-node-root"
      onMouseDown={(e) => onMouseDown(e, node.id)}
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
        className="fgn-node-foreign-object"
        x={node.x + 10}
        y={node.y + 5}
        width={node.width - 20}
        height={25}
      >
        <div className="fgn-node-label-container">
          {iconToRender && (
            <div
              className="fgn-node-icon-wrapper"
              style={{
                color: node.color || '#000000'
              }}
            >
              {iconToRender}
            </div>
          )}
          <span className="fgn-node-label-text">
            {node.label}
          </span>
        </div>
      </foreignObject>
      
      {/* Left connection point (Input) */}
      <circle
        className="fgn-node-connection-point"
        cx={node.leftConnectionPoint.x}
        cy={node.leftConnectionPoint.y}
        r={connectionRadius}
        fill="#4CAF50"
        stroke="white"
        strokeWidth={2}
        data-node-id={node.id}
        data-connection-type="left"
        onMouseDown={handleLeftConnectionMouseDown}
      />
      
      {/* Right connection point (Output) */}
      <circle
        className="fgn-node-connection-point"
        cx={node.rightConnectionPoint.x}
        cy={node.rightConnectionPoint.y}
        r={connectionRadius}
        fill="#FF5722"
        stroke="white"
        strokeWidth={2}
        data-node-id={node.id}
        data-connection-type="right"
        onMouseDown={handleRightConnectionMouseDown}
      />

      {/* Status badge */}
      {node.status && statusStyle && (
        <foreignObject
          className="fgn-node-foreign-object"
          x={node.x + node.width / 2 - 20}
          y={node.y + node.height / 2 - 8}
          width="40"
          height="16"
        >
          <div
            className="fgn-node-status-badge"
            style={{
              backgroundColor: statusStyle.backgroundColor,
              borderColor: statusStyle.borderColor || statusStyle.backgroundColor,
              color: statusStyle.textColor
            }}
          >
            {node.status}
          </div>
        </foreignObject>
      )}

      {/* Bottom left label */}
      {node.bottomLeftLabel && (
        <foreignObject
          className="fgn-node-foreign-object"
          x={node.x + 5}
          y={node.y + node.height - 20}
          width={node.width - 10}
          height="20"
        >
          <div className="fgn-node-bottom-label">
            {node.bottomLeftLabel}
          </div>
        </foreignObject>
      )}

      {/* Action buttons */}
      {showActions && hasActions && (
        <foreignObject
          className="fgn-node-foreign-object"
          x={node.x + 8}
          y={node.y + node.height - 32}
          width={node.width - 16}
          height="60"
        >
          <div 
            className="node-actions fgn-node-actions-wrapper" 
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Visible actions */}
            {actionsGroup.visibleActions.map((action) => (
              <button
                key={action.id}
                className={`node-action-button ${action.className || ''}`}
                onClick={(e) => handleActionClick(e, action.onClick)}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={isActionDisabled(action)}
                data-tooltip={action.id}
                title=""
              >
                {action.label}
              </button>
            ))}
            
            {/* Dropdown button */}
            {actionsGroup.hasDropdown && (
              <div className="fgn-node-dropdown-wrapper">
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
                  <div className="fgn-node-dropdown-menu">
                    {actionsGroup.dropdownActions.map((action) => (
                      <button
                        key={action.id}
                        className="fgn-node-dropdown-item"
                        onClick={(e) => {
                          handleActionClick(e, action.onClick);
                          setShowDropdown(false);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        disabled={isActionDisabled(action)}
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

