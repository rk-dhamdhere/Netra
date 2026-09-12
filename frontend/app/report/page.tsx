"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  MapPin, 
  Network, 
  Users, 
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import dynamic from "next/dynamic";

const NetworkGraph = dynamic(() => import("../../components/NetworkGraph"), { ssr: false });
const LiveHeatmap = dynamic(() => import("../../components/LiveHeatmap"), { ssr: false });

export default function TechnicalReportPage() {
  const [hasNewIntel, setHasNewIntel] = useState(false);
  
  const [metrics, setMetrics] = useState({ persons: 0, objects: 0, locations: 0, relationships: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasNewIntel(sessionStorage.getItem("netra_new_intel_added") === "true");
      
      const cached = sessionStorage.getItem("netra_extracted_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setMetrics({
            persons: parsed.persons?.length || 0,
            objects: parsed.objects?.length || 0,
            locations: parsed.locations?.length || 0,
            relationships: parsed.relationships?.length || 0,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      <GlobalHeader classification="CONFIDENTIAL" />

      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                Technical Investigation Report
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Dynamic Case Overview &amp; Fused Intelligence Analytics
              </p>
            </div>
          </div>
          <Link
            href="/intel"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Intel Pipeline</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 space-y-4">
        
        {hasNewIntel && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-emerald-100 rounded-full shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">Intelligence Matrix Updated</h3>
              <p className="text-xs text-emerald-700 mt-1">
                New field intelligence has been successfully fused into the case payload. 
                The knowledge graph and spatial hotspots have been recalculated to reflect the latest correlations.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Persons Tracked</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.persons}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Objects Flagged</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.objects}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Geo Hotspots</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.locations}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Network className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Graph Edges</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.relationships}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
            <div className="p-3 border-b border-slate-100 flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase">Updated Knowledge Graph</h2>
            </div>
            <div className="flex-1 p-2 min-h-[400px]">
              <NetworkGraph />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
            <div className="p-3 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase">Geospatial Correlation Map</h2>
            </div>
            <div className="flex-1 p-2 min-h-[400px]">
              <LiveHeatmap />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
