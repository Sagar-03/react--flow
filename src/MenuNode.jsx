import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import Popup from './Popup';

// Predefined color palette for menu items
const colorPalette = [
  '#FF5733', // Red-Orange
  '#33A1FD', // Blue
  '#2ECC71', // Green
  '#9B59B6', // Purple
  '#F1C40F', // Yellow
  '#E74C3C', // Red
  '#1ABC9C', // Teal
  '#FF9FF3', // Pink
  '#A3CB38', // Lime
  '#5352ED'  // Indigo
];

function MenuNode({ id, data }) {
  const [items, setItems] = useState(data.items || []);
  const [itemColors, setItemColors] = useState({});
  const [newItem, setNewItem] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const reactFlow = useReactFlow();

  // Assign colors to new items
  useEffect(() => {
    const newItemColors = {...itemColors};
    let hasNewItems = false;
    
    items.forEach((item, index) => {
      if (!newItemColors[item]) {
        // Use modulo to cycle through colors if there are more items than colors
        newItemColors[item] = colorPalette[index % colorPalette.length];
        hasNewItems = true;
      }
    });
    
    if (hasNewItems) {
      setItemColors(newItemColors);
    }
  }, [items]);

  // We'll track if items were changed internally
  const [itemsChangedByUser, setItemsChangedByUser] = useState(false);
  
  // Update edges whenever items change from user interaction
  useEffect(() => {
    if (data.onItemsChange && itemsChangedByUser) {
      // Pass both items and their colors
      data.onItemsChange(id, items, itemColors);
      // Reset the flag after handling the change
      setItemsChangedByUser(false);
    }
  }, [itemsChangedByUser, id, data, items, itemColors]);

  const addItem = () => {
    if (newItem.trim() === '') return;
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItem('');
    setItemsChangedByUser(true);
  };

  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    setItemsChangedByUser(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const handleSavePopup = (nodeId, updatedData) => {
    // Update the items and other data
    if (updatedData.items) {
      setItems(updatedData.items);
      setItemsChangedByUser(true);
    }
    
    // Update other node properties through the reactFlow instance
    const { getNodes, setNodes } = reactFlow;
    const updatedNodes = getNodes().map(node => {
      if (node.id === id) {
        // Update the node data while preserving any fields not in updatedData
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData,
            onItemsChange: data.onItemsChange // Preserve callback function
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
  };

  return (
    <div className="menu-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          {data.label || 'Menu Items'}
          <button 
            className="nodrag edit-node-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            ✏️
          </button>
        </div>
        
        <div className="menu-items">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="menu-item"
              style={{
                backgroundColor: itemColors[item] ? `${itemColors[item]}22` : '#f5f5f5',
                borderLeft: `4px solid ${itemColors[item] || '#ccc'}`
              }}
            >
              <div className="menu-item-content">
                <div 
                  className="color-indicator" 
                  style={{ backgroundColor: itemColors[item] || '#ccc' }} 
                />
                <span>{item}</span>
              </div>
              <button 
                className="nodrag remove-btn" 
                onClick={() => removeItem(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="add-item-container">
          <input
            className="nodrag menu-input"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new item..."
          />
          <button className="nodrag add-btn" onClick={addItem}>Add</button>
        </div>
        
        <div className="node-type">Menu Node</div>
      </div>

      {/* Create a dynamic set of handles based on items */}
      {items.map((item, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Bottom}
          id={`item-${index}`}
          style={{ 
            left: `${(index + 1) * (100 / (items.length + 1))}%`,
            backgroundColor: itemColors[item] || '#888',
            border: `2px solid ${itemColors[item] || '#888'}`
          }}
        />
      ))}
      
      {/* Popup for editing the node */}
      <Popup 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        node={{ id, type: 'Menu', data: { ...data, items } }}
        onSave={handleSavePopup}
      />
    </div>
  );
}

export default MenuNode;
