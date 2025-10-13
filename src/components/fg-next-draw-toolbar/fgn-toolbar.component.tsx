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
    if (item.onDragStart) {
      item.onDragStart(e, item);
    } else {
      if (item.label) {
        e.dataTransfer.setData('nodeLabel', item.label);
      }
    }
  };

  const handleClick = (item: FgnToolbarItem) => {
    if (item.onClick) {
      item.onClick(item);
    }
  };

  const renderDefaultItem = (item: FgnToolbarItem) => {
    const itemStyle = { ...styles.toolbarItem };
    
    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(e, item)}
        onClick={() => handleClick(item)}
        style={itemStyle}
        className={item.className}
      >
        {item.icon && <div style={styles.iconContainer}>{item.icon}</div>}
        {!item.icon && <div style={styles.nodePreview}></div>}
        <span>{item.label}</span>
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

  const toolbarStyle = { ...styles.toolbar, ...style };

  return (
    <div className={`fgn-toolbar ${className}`} style={toolbarStyle}>
      {items.map((item) => renderItem(item))}
    </div>
  );
};

const styles = {
  toolbar: {
    width: '100px',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRight: '1px solid #ccc',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  toolbarItem: {
    padding: '10px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '5px',
  },
  nodePreview: {
    width: '40px',
    height: '30px',
    backgroundColor: '#4A90E2',
    borderRadius: '4px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '30px',
  },
};

export default FgnToolbarComponent;

