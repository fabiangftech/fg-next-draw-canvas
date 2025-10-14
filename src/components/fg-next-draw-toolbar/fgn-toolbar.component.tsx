import React from 'react';
import './fgn-toolbar.component.css';
import { FgnToolbarProps, FgnToolbarItem } from './model/fgn-toolbar-item.model';

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
      if (item.label) {
        e.dataTransfer.setData('nodeLabel', item.label);
      }
      if (item.icon) {
        // Pass icon type as string since React components can't be serialized
        e.dataTransfer.setData('nodeIconType', item.id);
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

  const renderDefaultItem = (item: FgnToolbarItem) => {
    const itemClassName = `fgn-toolbar-item ${item.className || ''}`.trim();
    const itemStyle = item.color ? { backgroundColor: item.color, color: 'white' } : {};
    
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onClick={() => handleClick(item)}
        className={itemClassName}
        style={itemStyle}
      >
        {item.icon && (
          <div className="fgn-toolbar-item-icon">
            {item.icon}
          </div>
        )}
        {!item.icon && <div style={styles.nodePreview}></div>}
        {item.tooltip && (
          <div className="fgn-toolbar-tooltip">
            {item.tooltip}
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

