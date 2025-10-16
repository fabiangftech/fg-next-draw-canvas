import React from 'react';
import { FgnNodeModel } from './fgn-node.model';

export interface FgnNodeAction {
  id: string;
  label: string | React.ReactElement;
  onClick: (nodeId: string) => void;
  className?: string;
  disabled?: boolean;
  isDisabled?: (node: FgnNodeModel) => boolean;
  order?: number;
}

