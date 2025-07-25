import { createContext, useContext, useState, useCallback } from 'react';

// Extended context now includes the type, setter, a callback for adding nodes by click, and position management
const DnDContext = createContext([null, (_) => {}, (_) => {}, null, null]);

export const DnDProvider = ({ children }) => {
  const [type, setType] = useState(null);
  const [clickedNodeType, setClickedNodeType] = useState(null);
  // Keep track of all node positions to avoid overlapping
  const [nodePositions, setNodePositions] = useState([]);

  // Find a non-overlapping position for a new node
  const getNextAvailablePosition = useCallback(() => {
    // Default starting position
    const baseX = 100;
    const baseY = 100;
    const nodeSize = { width: 150, height: 80 }; // Approximate node dimensions
    const spacing = 20; // Spacing between nodes
    
    // If no nodes exist yet, return the default position
    if (nodePositions.length === 0) {
      return { x: baseX, y: baseY };
    }
    
    // Try positions in a grid-like pattern
    let col = 0;
    let row = 0;
    let maxAttempts = 100; // Safety limit
    
    while (maxAttempts > 0) {
      const posX = baseX + col * (nodeSize.width + spacing);
      const posY = baseY + row * (nodeSize.height + spacing);
      
      // Check if this position overlaps with any existing node
      const overlaps = nodePositions.some(pos => {
        return (
          Math.abs(pos.x - posX) < nodeSize.width &&
          Math.abs(pos.y - posY) < nodeSize.height
        );
      });
      
      if (!overlaps) {
        // Found a non-overlapping position
        return { x: posX, y: posY };
      }
      
      // Move to next position in grid
      col++;
      if (col > 3) { // After 4 columns, move to next row
        col = 0;
        row++;
      }
      
      maxAttempts--;
    }
    
    // Fallback: Add some random offset to avoid exact overlapping
    return { 
      x: baseX + Math.random() * 200, 
      y: baseY + Math.random() * 200 
    };
  }, [nodePositions]);

  // Function to handle adding a node by clicking instead of dragging
  const addNodeByClick = useCallback((nodeType) => {
    // Get a non-overlapping position for the new node
    const position = getNextAvailablePosition();
    
    // Set the node type and position to be used in the App component
    setClickedNodeType({
      type: nodeType,
      position
    });
    
    // Track this position for future node placements
    setNodePositions(prev => [...prev, position]);
    
    // Reset the clicked node type after a short delay
    setTimeout(() => {
      setClickedNodeType(null);
    }, 100);
  }, [getNextAvailablePosition]);

  return (
    <DnDContext.Provider value={[type, setType, addNodeByClick, clickedNodeType, setNodePositions]}>
      {children}
    </DnDContext.Provider>
  );
}

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
}