import React, { useState, useEffect, useRef } from 'react';
import './popup.css';

function Popup({ isOpen, onClose, node, onSave }) {
  const [nodeData, setNodeData] = useState({});
  const popupRef = useRef(null);

  // Initialize the form with the node data
  useEffect(() => {
    if (node && isOpen) {
      setNodeData({ ...node.data });
    }
  }, [node?.id, node?.data, isOpen]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNodeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(node.id, nodeData);
    onClose();
  };

  if (!isOpen || !node) return null;

  // Render different forms based on node type
  const renderEditForm = () => {
    switch (node.type) {
      case 'Menu':
        return (
          <>
            <div className="form-group">
              <label htmlFor="label">Node Label</label>
              <input 
                type="text" 
                id="label" 
                name="label" 
                value={nodeData.label || ''} 
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Menu Items</label>
              <div className="menu-items-editor">
                {(nodeData.items || []).map((item, index) => (
                  <div key={index} className="menu-item-row">
                    <input 
                      type="text" 
                      value={item} 
                      onChange={(e) => {
                        const updatedItems = [...(nodeData.items || [])];
                        updatedItems[index] = e.target.value;
                        setNodeData(prev => ({
                          ...prev,
                          items: updatedItems
                        }));
                      }}
                      className="form-control"
                    />
                    <button 
                      type="button" 
                      className="remove-item-btn"
                      onClick={() => {
                        const updatedItems = [...(nodeData.items || [])];
                        updatedItems.splice(index, 1);
                        setNodeData(prev => ({
                          ...prev,
                          items: updatedItems
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-item-btn"
                  onClick={() => {
                    setNodeData(prev => ({
                      ...prev,
                      items: [...(prev.items || []), '']
                    }));
                  }}
                >
                  Add Item
                </button>
              </div>
            </div>
          </>
        );
      
      case 'textUpdater':
        return (
          <div className="form-group">
            <label htmlFor="label">Text Content</label>
            <textarea 
              id="label" 
              name="label" 
              value={nodeData.label || ''} 
              onChange={handleChange}
              className="form-control"
              rows="4"
            />
          </div>
        );
      
      case 'Dropdown':
        return (
          <>
            <div className="form-group">
              <label htmlFor="label">Dropdown Label</label>
              <input 
                type="text" 
                id="label" 
                name="label" 
                value={nodeData.label || ''} 
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Options</label>
              <div className="dropdown-options-editor">
                {(nodeData.options || []).map((option, index) => (
                  <div key={index} className="dropdown-option-row">
                    <input 
                      type="text" 
                      value={option} 
                      onChange={(e) => {
                        const updatedOptions = [...(nodeData.options || [])];
                        updatedOptions[index] = e.target.value;
                        setNodeData(prev => ({
                          ...prev,
                          options: updatedOptions
                        }));
                      }}
                      className="form-control"
                    />
                    <button 
                      type="button" 
                      className="remove-option-btn"
                      onClick={() => {
                        const updatedOptions = [...(nodeData.options || [])];
                        updatedOptions.splice(index, 1);
                        setNodeData(prev => ({
                          ...prev,
                          options: updatedOptions
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="add-option-btn"
                  onClick={() => {
                    setNodeData(prev => ({
                      ...prev,
                      options: [...(prev.options || []), '']
                    }));
                  }}
                >
                  Add Option
                </button>
              </div>
            </div>
          </>
        );
      
      default:
        return (
          <div className="form-group">
            <label htmlFor="label">Node Label</label>
            <input 
              type="text" 
              id="label" 
              name="label" 
              value={nodeData.label || ''} 
              onChange={handleChange}
              className="form-control"
            />
          </div>
        );
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup" ref={popupRef}>
        <div className="popup-header">
          <h3>Edit {node.type} Node</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-content">
          <form onSubmit={handleSubmit}>
            {renderEditForm()}
            <div className="popup-footer">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Popup;
