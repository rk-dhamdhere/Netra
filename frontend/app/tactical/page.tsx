"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Network, 
  Search, 
  Filter, 
  Layers, 
  Share2, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Phone, 
  Building2, 
  Car, 
  MapPin, 
  Eye, 
  Download, 
  Maximize2,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Users
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";
import NetworkGraph from "../../components/NetworkGraph";

export default function TacticalDashboardPage() {
  const [selectedEntity] = useState({
    name: "No entity selected",
    role: "Awaiting investigation data",
    id: "—",
    aadhaar: "—",
    phone: "—",
    riskScore: 0,
    riskLevel: "NO DATA",
    connections: 0,
    flaggedAmount: "₹0",
  });

  const [filterType, setFilterType] = useState("ALL");

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      {/* Global Header */}
      <GlobalHeader 
        caseId="" 
        classification="CONFIDENTIAL" 
      />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={5} 
        caseSubtitle="No active case selected · Multi-Agency AI Tactical Intelligence Graph" 
      />

      {/* Subheader Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0c162c] text-white flex items-center justify-center shadow-xs">
              <Network className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                Tactical Command Dashboard &amp; Graph AI Matrix
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Step 5 of 6 · Realtime Graph Neural Network (GNN) Entity Correlation &amp; Centrality Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>GNN Confidence: 94.8%</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              0 Nodes · 0 Linkages
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 space-y-4">
        
        {/* Top 4 Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Tracked Entities</span>
              <div className="text-xl font-black text-slate-900">0 Nodes</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Hawala Loops</span>
              <div className="text-xl font-black text-red-600">₹0</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Tower Intercepts</span>
              <div className="text-xl font-black text-emerald-600">0 Pings</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">CCTV Facial Match</span>
              <div className="text-xl font-black text-amber-600">No data</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 2-Column Tactical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT: Full Interactive Knowledge Graph (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
            
            {/* Graph Controls Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Interactive Entity Knowledge Graph
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                {["ALL", "SUSPECTS", "BANK ACCTS", "VEHICLES", "PHONES"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterType(tab)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      filterType === tab
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Graph Canvas */}
            <div className="w-full h-[460px]">
              <NetworkGraph />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Graph Clustering: ForceAtlas2 Physics Algorithm Active</span>
              <span className="text-indigo-600 font-bold">Node Centrality: Betweenness 0.78</span>
            </div>

          </div>

          {/* RIGHT: Entity Inspector & Live Alerts (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            
            {/* Selected Node Inspector Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Entity Inspector
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  NO DATA
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-base shadow-sm">—</div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedEntity.name}</div>
                  <div className="text-xs text-slate-500">{selectedEntity.role}</div>
                  <div className="text-[10px] font-mono text-blue-600">{selectedEntity.id}</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-1 border-t border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Aadhaar ID</span>
                  <span className="font-mono font-semibold">{selectedEntity.aadhaar}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Primary Phone</span>
                  <span className="font-mono font-semibold">{selectedEntity.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Direct Linkages</span>
                  <span className="font-semibold text-slate-900">{selectedEntity.connections} Connected Nodes</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Flagged Hawala Volume</span>
                  <span className="font-bold text-red-600">{selectedEntity.flaggedAmount}</span>
                </div>
              </div>

              <Link
                href="/review"
                className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#0c162c] hover:bg-[#152342] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Open Full Evidence Dossier</span>
              </Link>
            </div>

            {/* Live Intelligence Feed Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5 flex-1">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Realtime Graph Alerts
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="py-6 text-center text-xs text-slate-500">No graph alerts available</div>
            </div>

          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-500">
            Multi-Agency Graph Linkage synchronized across NCRB, NATGRID, and CCTNS
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/processing"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Back to AI Processing
            </Link>

            <Link
              href="/intel"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0c162c] hover:bg-[#152342] text-white font-bold shadow-md shadow-slate-900/20 transition-all cursor-pointer"
            >
              <span>Proceed to Field Intel Update</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
