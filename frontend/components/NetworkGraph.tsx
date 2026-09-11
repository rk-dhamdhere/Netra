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

const emptyNodes: any[] = [];
const emptyEdges: any[] = [];

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
  const visualWeight = nodeData.visual_weight || "standard";
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
        visual_weight: visualWeight,
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
      visual_weight: visualWeight,
    },
    style,
  };
}

export default function NetworkGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);

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

        const nodeWeights = new Map(layoutedNodes.map((node: any) => [node.id, node.data?.visual_weight]));
        const parsedEdges = (data.edges || []).map((edge: any) => {
          const sourceWeight = nodeWeights.get(String(edge.source));
          return {
            id: String(edge.id || `${edge.source}-${edge.target}`),
            source: String(edge.source),
            target: String(edge.target),
            label: edge.label || edge.type || "RELATED_TO",
            animated: sourceWeight === "kingpin",
            style: {
              stroke: sourceWeight === "kingpin" ? "#b91c1c" : sourceWeight === "mule" ? "#d97706" : "#6366f1",
              strokeWidth: sourceWeight === "kingpin" ? 4 : sourceWeight === "mule" ? 1 : 2,
            },
            data: edge.data,
          };
        });

        setNodes(layoutedNodes);
        setEdges(parsedEdges);
        setNodeCount(layoutedNodes.length);
        setEdgeCount(parsedEdges.length);
        setIsLive(true);
      } else {
        // Backend connected but no nodes yet: keep the graph empty.
        setNodes([]);
        setEdges([]);
        setNodeCount(0);
        setEdgeCount(0);
        setIsLive(false);
      }
    } catch (_err) {
      // Backend unavailable: gracefully stay empty.
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setEdgeCount(0);
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
              <span>No graph data available</span>
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
        {nodes.length === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-xs text-slate-500 pointer-events-none">
            No entities available
          </div>
        )}
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
