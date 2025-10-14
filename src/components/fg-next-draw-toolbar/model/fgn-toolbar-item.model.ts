import React from 'react';
import { IconConfig } from '../../shared/icon-config.service';

/**
 * Interface for toolbar item configuration
 */
export interface FgnToolbarItem {
  id: string;
  label?: string; // Optional, can be overridden by iconCode
  icon?: React.ReactNode; // Fallback for manual icon override
  iconCode?: string; // Primary way to specify icon via service
  color?: string; // Fallback for manual color override
  tooltip?: string;
  component?: React.ComponentType<FgnToolbarItemProps>;
  getIconConfig?: (code: string) => IconConfig | null;
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
  items: FgnToolbarItem[];
  className?: string;
  style?: React.CSSProperties;
  renderCustomItem?: (item: FgnToolbarItem, defaultRenderer: (item: FgnToolbarItem) => React.ReactNode) => React.ReactNode;
}

