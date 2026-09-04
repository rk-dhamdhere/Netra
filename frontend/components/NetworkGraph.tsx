"use client";
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PersonNode from './PersonNode';

// Register custom node types
const nodeTypes = {
  person: PersonNode,
};

const initialNodes = [
  { 
    id: '1', 
    type: 'person', // This tells React Flow to use your custom component
    position: { x: 250, y: 100 }, 
    data: { label: 'K. Ansari' }, 
  },
  { 
    id: '2', 
    position: { x: 100, y: 250 }, 
    data: { label: '+91-98XXX-41122 (Phone)' },
    style: { border: '1px solid #555', borderRadius: '8px', padding: '10px', background: '#f9f9f9', color: '#111827' }
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, label: 'Owns' },
];

export default function NetworkGraph() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', backgroundColor: '#f8fafc' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} nodeTypes={nodeTypes} fitView>
        <Background color="#ccc" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}