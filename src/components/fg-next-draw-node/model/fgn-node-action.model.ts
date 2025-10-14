export interface FgnNodeAction {
  id: string;
  label: string;
  onClick: (nodeId: string) => void;
  className?: string;
  disabled?: boolean;
  order?: number;
}

