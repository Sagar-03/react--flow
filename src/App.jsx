import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  MiniMap
} from '@xyflow/react';
import TextUpdaterNode from './TextUpdater';
import DropdownNode from './Dropdown';
import MenuNode from './MenuNode';
import ResizableNodeSelected from './Resizablenode';
import withResizable from './withResizable';
import '@xyflow/react/dist/style.css';
import './menu-node.css';
import './popup.css';
import './nodes.css';
import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';

// Wrap each node component with the resizable HOC
const ResizableTextUpdaterNode = withResizable(TextUpdaterNode);
const ResizableDropdownNode = withResizable(DropdownNode);
const ResizableMenuNode = withResizable(MenuNode);

const nodeTypes = {
  textUpdater: ResizableTextUpdaterNode,
  Dropdown: ResizableDropdownNode,
  Menu: ResizableMenuNode,
  resizable: ResizableNodeSelected,
};
const initialNodes = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  // const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type, _, __, clickedNodeType, setNodePositions] = useDnD();

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find(n => n.id === params.source);
    
    // If the source node is a Menu node, get the color for this connection
    let edgeStyle = {};
    if (sourceNode?.type === 'Menu' && params.sourceHandle) {
      // Extract the index from the sourceHandle ID (format: "item-{index}")
      const itemIndex = parseInt(params.sourceHandle.split('-')[1]);
      const item = sourceNode.data.items[itemIndex];
      const color = sourceNode.data.itemColors?.[item];
      
      if (color) {
        edgeStyle = {
          stroke: color,
          strokeWidth: 2,
        };
      }
    }
    
    return setEdges((eds) => addEdge({
      ...params,
      style: edgeStyle,
      animated: Boolean(edgeStyle.stroke), // Animate colored edges
    }, eds));
  }, [nodes]);

  // Handle menu item changes and update edges accordingly
  const handleMenuItemsChange = useCallback((nodeId, items, itemColors = {}) => {
    // First, remove any existing edges related to this menu node
    setEdges((eds) => {
      // Filter out edges connected to this node
      // but preserve their style/color for existing connections
      const edgesToKeep = eds.filter(edge => !edge.source.includes(nodeId));
      return edgesToKeep;
    });
    
    // For each item, create a potential connection point
    // This doesn't automatically connect to anything,
    // but makes the handles available for manual connections
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      // Update the node's data to store the current items and their colors
      setNodes((nds) => 
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: {
                ...n.data,
                items,
                itemColors
              }
            };
          }
          return n;
        })
      );
    }
  }, [setNodes, setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      // Create a unique ID for this node
      const newId = getId();
      
      // Prepare specific data based on node type
      let nodeData = { label: `${type} node` };
      
      // Add custom data for Dropdown node
      if (type === 'Dropdown') {
        nodeData = {
          label: 'Select an option:',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          defaultValue: '',
          onChange: (value) => console.log(`Dropdown value changed to: ${value}`)
        };
      }
      // Add custom data for Menu node
      else if (type === 'Menu') {
        nodeData = {
          label: 'Menu Items',
          items: ['Initial Item'],
          onItemsChange: handleMenuItemsChange
        };
      }
      
      const newNode = {
        id: newId,
        type,
        position,
        data: nodeData,
      };

      // Track this position for future node placements
      setNodePositions(prev => [...prev, position]);
      
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, handleMenuItemsChange, setNodePositions],
  );

  // Handle creation of a node when clicked in sidebar
  useEffect(() => {
    if (clickedNodeType) {
      // Create a unique ID for this node
      const newId = getId();
      
      // Get the non-overlapping position from context
      const nodeType = clickedNodeType.type;
      const position = clickedNodeType.position;
      
      // Prepare specific data based on node type
      let nodeData = { label: `${nodeType} node` };
      
      // Add custom data for Dropdown node
      if (nodeType === 'Dropdown') {
        nodeData = {
          label: 'Select an option:',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          defaultValue: '',
          onChange: (value) => console.log(`Dropdown value changed to: ${value}`)
        };
      }
      // Add custom data for Menu node
      else if (nodeType === 'Menu') {
        nodeData = {
          label: 'Menu Items',
          items: ['Initial Item'],
          onItemsChange: handleMenuItemsChange
        };
      }
      
      const newNode = {
        id: newId,
        type: nodeType,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    }
  }, [clickedNodeType, handleMenuItemsChange]);

  // Update node positions tracking when nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      const currentPositions = nodes.map(node => node.position);
      setNodePositions(currentPositions);
    }
  }, [nodes]);

  return (
    <div className="dndflow">
      <div className="dndflow-wrapper" style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          // minimap={true}  
          fitView
        >
          <Controls />
          <Background />
          <MiniMap nodeStrokeWidth={3} />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow />
    </DnDProvider>
  </ReactFlowProvider>
);
