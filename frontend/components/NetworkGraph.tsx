"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState, 
  useEdgesState 
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PersonNode from "./PersonNode";
import { RefreshCw, Database, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

const nodeTypes = {
  person: PersonNode,
};

const fallbackNodes = [
  { 
    id: "1", 
    type: "person",
    position: { x: 380, y: 120 }, 
    data: { label: "Karim Ansari (The Broker)", tier: "Kingpin", risk_score: 96 }, 
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
    data: { label: "Vikram alias Vicky (Node 1188)", tier: "Associate", risk_score: 87 }, 
  },
];

const fallbackEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, label: "Operates", style: { stroke: "#0284c7", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", animated: true, label: "Routes ₹4.7Cr", style: { stroke: "#dc2626", strokeWidth: 2 } },
  { id: "e1-4", source: "1", target: "4", animated: true, label: "Travels In", style: { stroke: "#16a34a", strokeWidth: 2 } },
  { id: "e1-5", source: "1", target: "5", animated: true, label: "Cash Drops", style: { stroke: "#d97706", strokeWidth: 2 } },
  { id: "e1-6", source: "1", target: "6", animated: true, label: "Sub-Handler", style: { stroke: "#7c3aed", strokeWidth: 2 } },
  { id: "e6-4", source: "6", target: "4", animated: true, label: "Spotted In CCTV", style: { stroke: "#059669", strokeWidth: 1.5 } },
  { id: "e6-5", source: "6", target: "5", animated: true, label: "Tower Ping 40291", style: { stroke: "#d97706", strokeWidth: 1.5 } },
];

function calculateRadialLayout(nodes: any[]) {
  const count = nodes.length;
  if (count <= 1) return nodes;
  
  const centerX = 380;
  const centerY = 200;
  const radius = Math.max(160, Math.min(300, count * 35));

  return nodes.map((node, index) => {
    // If the node already has varied layout, keep it
    if (node.position && (node.position.x !== 100 || node.position.y !== 100)) {
      return node;
    }
    const angle = (2 * Math.PI * index) / count - Math.PI / 2;
    const x = Math.round(centerX + radius * Math.cos(angle));
    const y = Math.round(centerY + (radius * 0.7) * Math.sin(angle));
    return {
      ...node,
      position: { x, y },
    };
  });
}

function processBackendNode(rawNode: any) {
  const nodeData = rawNode.data || {};
  const isPerson = 
    rawNode.type === "person" || 
    nodeData.tier !== undefined || 
    nodeData.risk_score !== undefined ||
    nodeData.is_kingpin !== undefined ||
    (typeof nodeData.name === "string" && !nodeData.type);

  if (isPerson) {
    return {
      id: String(rawNode.id),
      type: "person",
      position: rawNode.position || { x: 100, y: 100 },
      data: {
        ...nodeData,
        label: nodeData.name || nodeData.label || `Suspect ${rawNode.id}`,
      },
    };
  }

  // Determine styling based on Object type
  const objType = nodeData.type?.toLowerCase() || "";
  let style = { 
    border: "1px solid #64748b", 
    borderRadius: "8px", 
    padding: "8px 12px", 
    background: "#f8fafc", 
    color: "#334155", 
    fontSize: "11px", 
    fontWeight: "600" 
  };
  let labelPrefix = "";

  if (objType.includes("phone") || objType.includes("imei")) {
    style = { border: "1px solid #0284c7", borderRadius: "8px", padding: "8px 12px", background: "#f0f9ff", color: "#0369a1", fontSize: "11px", fontWeight: "600" };
    labelPrefix = "📱 ";
  } else if (objType.includes("vehicle") || objType.includes("car")) {
    style = { border: "1px solid #16a34a", borderRadius: "8px", padding: "8px 12px", background: "#f0fdf4", color: "#166534", fontSize: "11px", fontWeight: "600" };
    labelPrefix = "🚗 ";
  } else if (objType.includes("bank") || objType.includes("account") || objType.includes("organization")) {
    style = { border: "1px solid #dc2626", borderRadius: "8px", padding: "8px 12px", background: "#fef2f2", color: "#991b1b", fontSize: "11px", fontWeight: "600" };
    labelPrefix = "🏦 ";
  } else if (objType.includes("location") || objType.includes("place")) {
    style = { border: "1px solid #d97706", borderRadius: "8px", padding: "8px 12px", background: "#fffbeb", color: "#92400e", fontSize: "11px", fontWeight: "600" };
    labelPrefix = "📍 ";
  }

  const label = nodeData.value || nodeData.name || nodeData.identifier_value || nodeData.label || rawNode.id;

  return {
    id: String(rawNode.id),
    position: rawNode.position || { x: 100, y: 100 },
    data: {
      ...nodeData,
      label: `${labelPrefix}${label}`,
    },
    style,
  };
}

export default function NetworkGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(fallbackNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(fallbackEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [nodeCount, setNodeCount] = useState(fallbackNodes.length);
  const [edgeCount, setEdgeCount] = useState(fallbackEdges.length);

  const fetchGraphData = useCallback(async () => {
    setIsLoading(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    try {
      const res = await fetch(`${backendUrl}/api/v1/graph-data`, {
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data && Array.isArray(data.nodes) && data.nodes.length > 0) {
        const parsedNodes = data.nodes.map(processBackendNode);
        const layoutedNodes = calculateRadialLayout(parsedNodes);

        const parsedEdges = (data.edges || []).map((edge: any) => ({
          id: String(edge.id || `${edge.source}-${edge.target}`),
          source: String(edge.source),
          target: String(edge.target),
          label: edge.label || edge.type || "RELATED_TO",
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2 },
          data: edge.data,
        }));

        setNodes(layoutedNodes);
        setEdges(parsedEdges);
        setNodeCount(layoutedNodes.length);
        setEdgeCount(parsedEdges.length);
        setIsLive(true);
      } else {
        // Backend connected but no nodes yet: keep fallback with notification
        setNodes(fallbackNodes);
        setEdges(fallbackEdges);
        setIsLive(false);
      }
    } catch (_err) {
      // Backend unavailable: gracefully stay on fallback
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  return (
    <div className="w-full h-full min-h-[380px] bg-slate-50/70 rounded-xl overflow-hidden border border-slate-200 relative flex flex-col">
      {/* Live Connection & Controls HUD */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-2">
        <div 
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-xs border transition-all backdrop-blur-md ${
            isLive 
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-300" 
              : "bg-slate-100/90 text-slate-600 border-slate-300"
          }`}
        >
          {isLive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Neo4j Live Sync ({nodeCount}N / {edgeCount}E)</span>
            </>
          ) : (
            <>
              <Database className="w-3 h-3 text-slate-500" />
              <span>Demo Topology (Standby)</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={fetchGraphData}
          disabled={isLoading}
          className="p-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh Graph from Neo4j / Taswi's API"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
        </button>
      </div>

      <div className="flex-1 w-full h-full">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          nodeTypes={nodeTypes} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls className="bg-white border border-slate-200 shadow-xs" />
        </ReactFlow>
      </div>
    </div>
  );
}