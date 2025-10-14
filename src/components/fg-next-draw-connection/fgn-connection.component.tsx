import React, { useState } from 'react';
import { FgnConnectionModel } from '../fg-next-draw-canvas/model/fgn-connection.model';
import { FgnNodeModel } from '../fg-next-draw-node/model/fgn-node.model';
import { generateConnectionPath } from '../fg-next-draw-canvas/utils/generate-connection-path.util';
import { calculatePathMidpoint } from '../fg-next-draw-canvas/utils/calculate-path-midpoint.util';
import './fgn-connection.component.css';

interface ConnectionProps {
  connection: FgnConnectionModel;
  sourceNode: FgnNodeModel;
  targetNode: FgnNodeModel;
  onDelete: (connectionId: string) => void;
}

const FgnConnectionComponent: React.FC<ConnectionProps> = ({
  connection,
  sourceNode,
  targetNode,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const pathData = generateConnectionPath(
    sourceNode.rightConnectionPoint,
    targetNode.leftConnectionPoint
  );
  
  const midpoint = calculatePathMidpoint(
    sourceNode.rightConnectionPoint,
    targetNode.leftConnectionPoint
  );
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(connection.id);
  };
  
  return (
    <g 
      className="fgn-connection"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible wider path for easier hover detection */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="fgn-connection-clickable"
      />
      
      {/* Visible connection path */}
      <path
        d={pathData}
        fill="none"
        stroke={isHovered ? "#2E5C8A" : "#4A90E2"}
        strokeWidth={2}
        className="connection-path"
        pointerEvents="none"
      />
      
      {/* Delete button - shown on hover */}
      {isHovered && (
        <g
          onClick={handleDelete}
          onMouseDown={(e) => e.stopPropagation()}
          className="fgn-connection-clickable"
        >
          <circle
            cx={midpoint.x}
            cy={midpoint.y}
            r={12}
            fill="#E74C3C"
            stroke="white"
            strokeWidth={2}
            className="delete-button"
          />
          <line
            x1={midpoint.x - 5}
            y1={midpoint.y - 5}
            x2={midpoint.x + 5}
            y2={midpoint.y + 5}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            pointerEvents="none"
          />
          <line
            x1={midpoint.x + 5}
            y1={midpoint.y - 5}
            x2={midpoint.x - 5}
            y2={midpoint.y + 5}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
            pointerEvents="none"
          />
        </g>
      )}
    </g>
  );
};

export default FgnConnectionComponent;

