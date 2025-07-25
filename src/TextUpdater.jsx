import { useCallback, useState } from 'react';
import { Handle, Position, NodeResizeControl, useReactFlow } from '@xyflow/react';
import Popup from './Popup';
 
function TextUpdaterNode({ data, id }) {
  const [value, setValue] = useState(data.label || '');
  const [isEditing, setIsEditing] = useState(false);
  const reactFlow = useReactFlow();
  
  const onChange = useCallback((evt) => {
    const newValue = evt.target.value;
    setValue(newValue);
    console.log(newValue);
  }, []);
 
  const handleSavePopup = (nodeId, updatedData) => {
    // Update the value
    if (updatedData.label) {
      setValue(updatedData.label);
    }
    
    // Update the node data through the reactFlow instance
    const { getNodes, setNodes } = reactFlow;
    const updatedNodes = getNodes().map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData
          }
        };
      }
      return node;
    });
    
    setNodes(updatedNodes);
  };

  return (
    <div className="text-updater-node">
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
      
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-header">
          <label htmlFor="text">Message:</label>
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
        <input 
          id="text" 
          name="text" 
          value={value}
          onChange={onChange} 
          className="nodrag" 
          placeholder="Enter bot message..."
        />
        <div className="node-type">Message Node</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
      
      {/* Popup for editing the node */}
      <Popup 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        node={{ id, type: 'textUpdater', data: { ...data, label: value } }}
        onSave={handleSavePopup}
      />
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
 
export default TextUpdaterNode;