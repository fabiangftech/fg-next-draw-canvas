import React from 'react';
import './fgn-toolbar.component.css';
import { FgnToolbarProps, FgnToolbarItem } from './model/fgn-toolbar-item.model';
import { defaultToolbarItems } from '../../factory';
import {defaultIconStrategy} from "../../strategy/impl/default-icon.strategy";

const FgnToolbarComponent: React.FC<FgnToolbarProps> = ({ 
  items = defaultToolbarItems, 
  className = '', 
  style,
  iconStrategy = defaultIconStrategy,
  renderCustomItem 
}) => {
  
  const handleDragStart = (e: React.DragEvent, item: FgnToolbarItem) => {
    // Get node label and background color directly from item
    const nodeLabel = item.label;
    const backgroundColor = item.color;
    
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
    dragPreview.style.cursor = 'grabbing';
    
    // Create icon element (only icon, no text)
    const iconToShow = iconStrategy ? iconStrategy.getIcon(item.code ?? item.id) : null;
    if (iconToShow) {
      const iconElement = document.createElement('div');
      iconElement.style.width = '32px';
      iconElement.style.height = '32px';
      iconElement.style.display = 'flex';
      iconElement.style.alignItems = 'center';
      iconElement.style.justifyContent = 'center';
      iconElement.style.color = backgroundColor ?? '#4A90E2';
      dragPreview.appendChild(iconElement);
    }
    
    document.body.appendChild(dragPreview);
    
    // Set drag image with offset to center it on cursor
    e.dataTransfer.setDragImage(dragPreview, 90, 45);
    
    // Clean up the drag preview after a short delay
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        dragPreview.remove();
      }
    }, 0);

    if (item.onDragStart) {
      item.onDragStart(e, item);
    } else {
      if (nodeLabel) {
        e.dataTransfer.setData('nodeLabel', nodeLabel);
      }
      if (item.code) {
        e.dataTransfer.setData('nodeIconCode', item.code);
      }
      if (item.color) {
        e.dataTransfer.setData('nodeColor', item.color);
      }
    }
  };

  const handleClick = (item: FgnToolbarItem) => {
    if (item.onClick) {
      item.onClick(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: FgnToolbarItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(item);
    }
  };

  const renderDefaultItem = (item: FgnToolbarItem) => {
    const itemClassName = `fgn-toolbar-item ${item.className ?? ''}`.trim();
    
    // Get icon from iconStrategy
    const iconToRender = iconStrategy ? iconStrategy.getIcon(item.code ?? item.id) : null;
    
    // Use color directly from item
    const backgroundColor = item.color;
    const itemStyle = backgroundColor ? { backgroundColor, color: 'white' } : {};
    
    // Use tooltip from item
    const tooltipText = item.tooltip ?? item.label;
    
    return (
      <button
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onClick={() => handleClick(item)}
        onKeyDown={(e) => handleKeyDown(e, item)}
        className={itemClassName}
        style={itemStyle}
        aria-label={tooltipText}
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
      </button>
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

