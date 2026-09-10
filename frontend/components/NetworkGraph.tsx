"use client";

import React from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PersonNode from "./PersonNode";

const nodeTypes = {
  person: PersonNode,
};

const initialNodes = [
  { 
    id: "1", 
    type: "person",
    position: { x: 380, y: 120 }, 
    data: { label: "Karim Ansari (The Broker)" }, 
  },
  { 
    id: "2", 
    position: { x: 120, y: 40 }, 
    data: { label: "📱 +91-98XXX-41122 (Primary IMEI)" },
    style: { border: "1px solid #0284c7", borderRadius: "8px", padding: "8px 12px", background: "#f0f9ff", color: "#0369a1", fontSize: "11px", fontWeight: "600" }
  },
  { 
    id: "3", 
    position: { x: 620, y: 60 }, 
    data: { label: "🏦 9 Shell Accounts (₹4.7 Cr Hawala)" },
    style: { border: "1px solid #dc2626", borderRadius: "8px", padding: "8px 12px", background: "#fef2f2", color: "#991b1b", fontSize: "11px", fontWeight: "600" }
  },
  { 
    id: "4", 
    position: { x: 140, y: 260 }, 
    data: { label: "🚗 DL-3C-AB-9214 (White Innova)" },
    style: { border: "1px solid #16a34a", borderRadius: "8px", padding: "8px 12px", background: "#f0fdf4", color: "#166534", fontSize: "11px", fontWeight: "600" }
  },
  { 
    id: "5", 
    position: { x: 600, y: 240 }, 
    data: { label: "📍 Sadar Bazar & Lajpat Drop Points" },
    style: { border: "1px solid #d97706", borderRadius: "8px", padding: "8px 12px", background: "#fffbeb", color: "#92400e", fontSize: "11px", fontWeight: "600" }
  },
  { 
    id: "6", 
    type: "person",
    position: { x: 380, y: 340 }, 
    data: { label: "Vikram alias Vicky (Node 1188)" }, 
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, label: "Operates", style: { stroke: "#0284c7", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", animated: true, label: "Routes ₹4.7Cr", style: { stroke: "#dc2626", strokeWidth: 2 } },
  { id: "e1-4", source: "1", target: "4", animated: true, label: "Travels In", style: { stroke: "#16a34a", strokeWidth: 2 } },
  { id: "e1-5", source: "1", target: "5", animated: true, label: "Cash Drops", style: { stroke: "#d97706", strokeWidth: 2 } },
  { id: "e1-6", source: "1", target: "6", animated: true, label: "Sub-Handler", style: { stroke: "#7c3aed", strokeWidth: 2 } },
  { id: "e6-4", source: "6", target: "4", animated: true, label: "Spotted In CCTV", style: { stroke: "#059669", strokeWidth: 1.5 } },
  { id: "e6-5", source: "6", target: "5", animated: true, label: "Tower Ping 40291", style: { stroke: "#d97706", strokeWidth: 1.5 } },
];

export default function NetworkGraph() {
  return (
    <div className="w-full h-full min-h-[380px] bg-slate-50/70 rounded-xl overflow-hidden border border-slate-200 relative">
      <ReactFlow 
        nodes={initialNodes} 
        edges={initialEdges} 
        nodeTypes={nodeTypes} 
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#cbd5e1" gap={16} />
        <Controls className="bg-white border border-slate-200 shadow-xs" />
      </ReactFlow>
    </div>
  );
}