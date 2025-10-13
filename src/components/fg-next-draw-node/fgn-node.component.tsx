import React from 'react';
import { FgnNodeModel } from './model/fgn-node.model';
import './fgn-node.component.css'

interface NodeProps {
  node: FgnNodeModel;
  onMouseDown: (e: React.MouseEvent, nodeId: string) => void;
}

const FgnNodeComponent: React.FC<NodeProps> = ({ node, onMouseDown }) => {
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
    </g>
  );
};

export default FgnNodeComponent;

