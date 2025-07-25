import React, { useState } from 'react';
import { Handle, Position, NodeResizeControl, useReactFlow } from '@xyflow/react';
import Popup from './Popup';

function DropdownNode({ data, id }) {
  const [selectedOption, setSelectedOption] = useState(data.defaultValue || '');
  const [isEditing, setIsEditing] = useState(false);
  const options = data.options || ['Option 1', 'Option 2', 'Option 3'];
  const reactFlow = useReactFlow();

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    
    // Call any onchange handler provided in data
    if (data.onChange) {
      data.onChange(value);
    }
  };
  
  const handleSavePopup = (nodeId, updatedData) => {
    // Update node properties through the reactFlow instance
    const { getNodes, setNodes } = reactFlow;
    const updatedNodes = getNodes().map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData,
            onChange: data.onChange // Preserve callback function
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
  };

  return (
    <div className="dropdown-node">
      <NodeResizeControl 
        style={{
          background: 'transparent',
          border: 'none',
        }}
        minWidth={250}
        minHeight={200}
      >
        <ResizeIcon />
      </NodeResizeControl>

      <Handle type="target" position={Position.Top} id="in" />
      
      <div className="node-content">
        <div className="node-header">
          {data.label || 'Choose an option'}
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
        <select 
          className="nodrag dropdown-select" 
          value={selectedOption} 
          onChange={handleChange}
        >
          <option value="" disabled>Please select...</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="node-type">Choice Node</div>
      </div>
      
      {/* Create a handle for each option */}
      
      {/* Popup for editing the node */}
      <Popup 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        node={{ id, type: 'Dropdown', data: { ...data, options } }}
        onSave={handleSavePopup}
      />
      {options.map((option, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Bottom}
          id={`option-${index}`}
          style={{ left: `${(index + 1) * (100 / (options.length + 1))}%` }}
        />
      ))}
    </div>
  );
}

function ResizeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#ff0071"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: 5, bottom: 5 }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
      <polyline points="8 4 4 4 4 8" />
      <line x1="4" y1="4" x2="10" y2="10" />
    </svg>
  );
}

export default DropdownNode;