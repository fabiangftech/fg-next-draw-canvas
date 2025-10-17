import React from 'react';
import { IconStrategy } from '../../../strategy/icon.strategy';

/**
 * Interface for toolbar item configuration
 */
export interface FgnToolbarItem {
  id: string;
  label?: string; // Optional label for the item
  code?: string; // Primary way to specify icon via iconStrategy
  color?: string; // Optional color override
  tooltip?: string;
  component?: React.ComponentType<FgnToolbarItemProps>;
  onDragStart?: (e: React.DragEvent, item: FgnToolbarItem) => void;
  onClick?: (item: FgnToolbarItem) => void;
  className?: string;
}

/**
 * Props passed to custom toolbar item components
 */
export interface FgnToolbarItemProps {
  item: FgnToolbarItem;
  onDragStart: (e: React.DragEvent) => void;
  onClick?: () => void;
}

/**
 * Props for the toolbar component
 */
export interface FgnToolbarProps {
  items?: FgnToolbarItem[];
  className?: string;
  style?: React.CSSProperties;
  iconStrategy?: IconStrategy;
  renderCustomItem?: (item: FgnToolbarItem, defaultRenderer: (item: FgnToolbarItem) => React.ReactNode) => React.ReactNode;
}

