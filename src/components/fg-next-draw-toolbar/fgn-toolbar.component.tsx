import React from 'react';
import './fgn-toolbar.component.css';
import { FgnToolbarProps, FgnToolbarItem } from './model/fgn-toolbar-item.model';
import { defaultGetIconConfig, defaultToolbarItems } from '../../factory';

const FgnToolbarComponent: React.FC<FgnToolbarProps> = ({ 
  items = defaultToolbarItems, 
  className = '', 
  style,
  renderCustomItem 
}) => {
  
  const handleDragStart = (e: React.DragEvent, item: FgnToolbarItem) => {
    // Get icon config and node label for preview
    const iconConfig = item.iconCode ? (item.getIconConfig || defaultGetIconConfig)(item.iconCode) : null;
    const nodeLabel = iconConfig?.label || item.label;
    const backgroundColor = iconConfig?.color || item.color;
    
    // Create a custom drag image that looks like a node preview
    const dragPreview = document.createElement('div');
    dragPreview.style.width = '180px';
    dragPreview.style.height = '90px';
    dragPreview.style.background = 'rgba(255, 255, 255, 0.9)';
    dragPreview.style.border = '2px dashed #999';
    dragPreview.style.borderRadius = '4px';
    dragPreview.style.opacity = '0.7';
    dragPreview.style.display = 'flex';
    dragPreview.style.alignItems = 'center';
    dragPreview.style.justifyContent = 'center';
    dragPreview.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.left = '-1000px';
    dragPreview.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    dragPreview.style.cursor = 'grabbing';
    
    // Create icon element (only icon, no text)
    if (iconConfig?.icon) {
      const iconElement = document.createElement('div');
      iconElement.style.width = '32px';
      iconElement.style.height = '32px';
      iconElement.style.display = 'flex';
      iconElement.style.alignItems = 'center';
      iconElement.style.justifyContent = 'center';
      iconElement.style.color = backgroundColor || '#4A90E2';
      dragPreview.appendChild(iconElement);
    }
    
    document.body.appendChild(dragPreview);
    
    // Set drag image with offset to center it on cursor
    e.dataTransfer.setDragImage(dragPreview, 90, 45);
    
    // Clean up the drag preview after a short delay
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);

    if (item.onDragStart) {
      item.onDragStart(e, item);
    } else {
      if (nodeLabel) {
        e.dataTransfer.setData('nodeLabel', nodeLabel);
      }
      if (item.iconCode) {
        e.dataTransfer.setData('nodeIconCode', item.iconCode);
      }
    }
  };

  const handleClick = (item: FgnToolbarItem) => {
    if (item.onClick) {
      item.onClick(item);
    }
  };

  const renderDefaultItem = (item: FgnToolbarItem) => {
    const itemClassName = `fgn-toolbar-item ${item.className || ''}`.trim();
    
    // Get icon config if iconCode is provided
    const iconConfig = item.iconCode ? (item.getIconConfig || defaultGetIconConfig)(item.iconCode) : null;
    
    // Use icon from config or fallback to manual icon
    const iconToRender = iconConfig?.icon || item.icon;
    
    // Use color from config or fallback to manual color
    const backgroundColor = iconConfig?.color || item.color;
    const itemStyle = backgroundColor ? { backgroundColor, color: 'white' } : {};
    
    // Use tooltip from config label or fallback to manual tooltip
    const tooltipText = item.tooltip || iconConfig?.label;
    
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onClick={() => handleClick(item)}
        className={itemClassName}
        style={itemStyle}
      >
        {iconToRender && (
          <div className="fgn-toolbar-item-icon">
            {iconToRender}
          </div>
        )}
        {!iconToRender && <div className="fgn-toolbar-node-preview"></div>}
        {tooltipText && (
          <div className="fgn-toolbar-tooltip">
            {tooltipText}
          </div>
        )}
      </div>
    );
  };

  const renderItem = (item: FgnToolbarItem) => {
    if (item.component) {
      const CustomComponent = item.component;
      return (
        <CustomComponent
          key={item.id}
          item={item}
          onDragStart={(e) => handleDragStart(e, item)}
          onClick={() => handleClick(item)}
        />
      );
    }

    if (renderCustomItem) {
      return renderCustomItem(item, renderDefaultItem);
    }

    return renderDefaultItem(item);
  };

  return (
    <div className={`fgn-toolbar ${className}`} style={style}>
      {items.map((item) => renderItem(item))}
    </div>
  );
};

export default FgnToolbarComponent;

