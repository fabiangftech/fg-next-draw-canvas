import React from 'react';
import './fgn-toolbar.component.css'

const FgnToolbarComponent: React.FC = () => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('nodeType', 'basic');
  };

  return (
    <div className={"fgn-toolbar"}>
      <div
        draggable
        onDragStart={handleDragStart}
        style={styles.toolbarItem}
      >
        <div style={styles.nodePreview}></div>
        <span>Node</span>
      </div>
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
};

export default FgnToolbarComponent;

