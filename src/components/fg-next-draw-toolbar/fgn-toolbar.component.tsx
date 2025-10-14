import React from 'react';
import './fgn-toolbar.component.css';
import { FgnToolbarProps, FgnToolbarItem } from './model/fgn-toolbar-item.model';
import { getIconConfig } from '../shared/icon-config.service';

const FgnToolbarComponent: React.FC<FgnToolbarProps> = ({ 
  items, 
  className = '', 
  style,
  renderCustomItem 
}) => {
  
  const handleDragStart = (e: React.DragEvent, item: FgnToolbarItem) => {
    // Create a custom drag image to hide the default cursor
    const dragImage = document.createElement('div');
    dragImage.style.width = '44px';
    dragImage.style.height = '44px';
    dragImage.style.borderRadius = '50%';
    dragImage.style.background = 'transparent';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 22, 22);
    
    // Clean up the drag image after a short delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);

    if (item.onDragStart) {
      item.onDragStart(e, item);
    } else {
      // Use iconCode if available, fallback to item.label
      const iconConfig = item.iconCode ? (item.getIconConfig || getIconConfig)(item.iconCode) : null;
      const nodeLabel = iconConfig?.label || item.label;
      
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
    const iconConfig = item.iconCode ? (item.getIconConfig || getIconConfig)(item.iconCode) : null;
    
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
        {!iconToRender && <div style={styles.nodePreview}></div>}
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

const styles = {
  nodePreview: {
    width: '24px',
    height: '18px',
    backgroundColor: '#4A90E2',
    borderRadius: '6px',
  },
};

export default FgnToolbarComponent;

