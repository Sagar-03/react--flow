import React from 'react';
import { useDnD } from './DnDContext';

export default () => {
  const [_, setType, addNodeByClick] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = (nodeType) => {
    // Call the addNodeByClick function from DnDContext
    addNodeByClick(nodeType);
  };

  return (
    <aside>
      <div className="description">You can drag these nodes or click to add them to the flow.</div>
      <div 
        className="dndnode input" 
        onDragStart={(event) => onDragStart(event, 'input')} 
        onClick={() => onNodeClick('input')}
        draggable
      >
        Input Node
      </div>
      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'default')} 
        onClick={() => onNodeClick('default')}
        draggable
      >
        Default Node
      </div>
      <div 
        className="dndnode output" 
        onDragStart={(event) => onDragStart(event, 'output')} 
        onClick={() => onNodeClick('output')}
        draggable
      >
        Output Node
      </div>
      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'textUpdater')} 
        onClick={() => onNodeClick('textUpdater')}
        draggable
      >
        Text Node
      </div>
      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'Dropdown')} 
        onClick={() => onNodeClick('Dropdown')}
        draggable
      >
        Dropdown Node
      </div>
      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'Menu')} 
        onClick={() => onNodeClick('Menu')}
        draggable
      >
        Menu Node
      </div>
      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'resizable')} 
        onClick={() => onNodeClick('resizable')}
        draggable
      >
        Resizable Node
      </div>
    </aside>
  );
};
