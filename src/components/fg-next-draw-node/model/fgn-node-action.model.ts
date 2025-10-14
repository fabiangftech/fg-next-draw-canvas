import React from 'react';

export interface FgnNodeAction {
  id: string;
  label: string | React.ReactElement;
  onClick: (nodeId: string) => void;
  className?: string;
  disabled?: boolean;
  order?: number;
}

