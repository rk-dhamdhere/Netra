"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  Radio, 
  Building2, 
  Users, 
  Camera, 
  BarChart3,
  Crosshair,
  Lock,
  Compass
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";

type ModuleStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "RESULT" | "ERROR";

type ModuleState = {
  id: string;
  label: string;
  status: ModuleStatus;
  progress: number;
  result?: string;
};

const STORAGE_KEY = "netra-processing-state-v2";

const INITIAL_MODULES: ModuleState[] = [
  { id: "OCR_INGEST", label: "CCTNS Document & FIR Ingestion", status: "COMPLETED", progress: 100 },
  { id: "NER_EXTRACT", label: "Gemini POLE+O Entity Extraction", status: "COMPLETED", progress: 100 },
  { id: "NEO4J_SYNC", label: "Knowledge Graph Topological Mapping", status: "COMPLETED", progress: 100 },
  { id: "GEO_RF", label: "Geospatial RF & Cell Tower Correlation", status: "COMPLETED", progress: 100 },
  { id: "FACTAI", label: "Multi-Agency Facial Vector Match", status: "RESULT", progress: 100, result: "2 MATCHES FOUND" },
  { id: "FIN_INT", label: "FIU-IND Suspicious Transaction Matrix", status: "COMPLETED", progress: 100 }
];

function getDisplayStatus(module: ModuleState) {
  if (module.status === "RESULT") {
    return module.result ?? "RESULT";
  }
  if (module.status === "PROCESSING") {
    return `PROCESSING ${Math.min(99, Math.max(1, module.progress))}%`;
  }
  return module.status;
}

function calculateProgress(modules: ModuleState[]) {
  const total = modules.length;
  if (total === 0) return 0;
  const completed = modules.filter((m) => m.status === "COMPLETED" || m.status === "RESULT").length;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

interface ExtractedObjectItem {
  type?: string;
  is_burner?: boolean;
}

export default function AIProcessingPage() {
  const [bearing, setBearing] = useState(42);

  // Lazy evaluation safely handles client-side storage without triggering effect warnings
  const [metrics] = useState(() => {
    if (typeof window === "undefined") {
      return { entitiesCount: 3, cdrCount: 128, facialMatches: 2, towerPings: 18, shellAccounts: 1, suspectLinks: 3 };
    }
    try {
      const cached = sessionStorage.getItem("netra_extracted_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        const persons = parsed.persons || [];
        const objects: ExtractedObjectItem[] = parsed.objects || [];
        const locations = parsed.locations || [];
        const relationships = parsed.relationships || [];

        const totalEntities = persons.length + objects.length + locations.length;
        const phoneObjs = objects.filter((o) => o.type?.toLowerCase() === "phone" || o.is_burner).length;
        const bankObjs = objects.filter((o) => o.type?.toLowerCase() === "bankaccount" || o.is_burner).length;

        return {
          entitiesCount: totalEntities > 0 ? totalEntities : 3,
          cdrCount: phoneObjs > 0 ? phoneObjs * 32 : 128,
          facialMatches: persons.length > 0 ? persons.length : 2,
          towerPings: locations.length > 0 ? locations.length * 6 : 18,
          shellAccounts: bankObjs > 0 ? bankObjs : 1,
          suspectLinks: relationships.length > 0 ? relationships.length : 3,
        };
      }
    } catch {
      // Fallback
    }
    return { entitiesCount: 3, cdrCount: 128, facialMatches: 2, towerPings: 18, shellAccounts: 1, suspectLinks: 3 };
  });

  const [modules, setModules] = useState<ModuleState[]>(() => {
    if (typeof window === "undefined") return INITIAL_MODULES;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ModuleState[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_MODULES;
  });

  const progress = calculateProgress(modules);
  const completedCount = modules.filter((m) => m.status === "COMPLETED" || m.status === "RESULT").length;
  const isComplete = modules.length > 0 && modules.every((m) => m.status === "COMPLETED" || m.status === "RESULT");

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
    }
  }, [modules]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBearing((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setModules((currentModules) => {
        const nextModules = currentModules.map((module) => ({ ...module }));
        const activeIndex = nextModules.findIndex((module) => module.status === "PROCESSING");

        if (activeIndex !== -1) {
          const activeModule = nextModules[activeIndex];
          const nextProgress = Math.min(100, activeModule.progress + 15);
          activeModule.progress = nextProgress;

          if (nextProgress >= 100) {
            activeModule.status = activeModule.id === "FACTAI" ? "RESULT" : "COMPLETED";
            activeModule.progress = 100;
            activeModule.result = activeModule.id === "FACTAI" ? "2 MATCHES FOUND" : undefined;

            const nextPendingIndex = nextModules.findIndex(
              (module, index) => index > activeIndex && module.status === "PENDING"
            );

            if (nextPendingIndex !== -1) {
              nextModules[nextPendingIndex].status = "PROCESSING";
              nextModules[nextPendingIndex].progress = 10;
            }
          }

          return nextModules;
        }

        const pendingIndex = nextModules.findIndex((module) => module.status === "PENDING");
        if (pendingIndex === -1) {
          return nextModules;
        }

        nextModules[pendingIndex].status = "PROCESSING";
        nextModules[pendingIndex].progress = 10;
        return nextModules;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col antialiased">
      <GlobalHeader classification="CONFIDENTIAL" />
      <StepperNav currentStep={4} caseSubtitle="Active Case Docket · Multi-Agency AI Tactical Processing Engine" />

      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-xs">
              <Cpu className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-slate-900">
                  NCRB Multi-Agency AI Analysis Engine
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold tracking-wider uppercase">
                  ACTIVE PIPELINE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Secure Multi-Agency Intelligence Processing &amp; Correlation Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]">
              <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
              <span>BEARING: {bearing.toString().padStart(3, "0")}° TRUE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{completedCount} STAGES LOCKED</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>AES-256 GCM</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between relative">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
              <Crosshair className="w-4 h-4 text-blue-600" />
              <span>Geospatial RF &amp; Entity Sonar Radar</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 font-medium">
              <span>RANGE: 35 KM</span>
              <span>·</span>
              <span>L-BAND 1800/2100 MHz</span>
            </div>
          </div>

          <div className="my-5 flex items-center justify-center">
            <div className="relative w-80 h-80 sm:w-100 sm:h-100 rounded-full border-4 border-slate-200 bg-[#070e1c] shadow-xl flex items-center justify-center overflow-hidden select-none">
              <div className="absolute top-2 font-mono text-[9px] font-bold text-cyan-400">000° N</div>
              <div className="absolute bottom-2 font-mono text-[9px] font-bold text-cyan-400">180° S</div>
              <div className="absolute right-2 font-mono text-[9px] font-bold text-cyan-400">090° E</div>
              <div className="absolute left-2 font-mono text-[9px] font-bold text-cyan-400">270° W</div>

              <div className="absolute w-[85%] h-[85%] rounded-full border border-cyan-500/20 border-dashed" />
              <div className="absolute w-[65%] h-[65%] rounded-full border border-cyan-500/25" />
              <div className="absolute w-[45%] h-[45%] rounded-full border border-cyan-500/20 border-dashed" />
              <div className="absolute w-[25%] h-[25%] rounded-full border border-cyan-500/30" />
              <div className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />

              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/30" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/30" />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-cyan-300/80">
                ACTIVE RADAR SCANNING
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500">SWEPT AZIMUTH</span>
              <span className="text-slate-900 font-bold text-xs mt-0.5">360° CONTINUOUS</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500">RADAR FREQUENCY</span>
              <span className="text-slate-900 font-bold text-xs mt-0.5">2.45 GHz S-BAND</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500">MATCH CONFIDENCE</span>
              <span className="text-emerald-700 font-bold text-xs mt-0.5">94.8% NETRA AI</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500">SECURITY PROTOCOL</span>
              <span className="text-blue-700 font-bold text-xs mt-0.5">TLS 1.3 / AES-GCM</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Entities</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{metrics.entitiesCount}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Parsed via Gemini</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">CDR Logs</span>
                <Phone className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{metrics.cdrCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold">Indexed</div>
            </div>

            <div className="rounded-xl border border-amber-200 p-3 shadow-xs flex flex-col justify-between bg-amber-50/30">
              <div className="flex items-center justify-between text-amber-700 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Facial Match</span>
                <Camera className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600 mt-1">{metrics.facialMatches}</div>
              <div className="text-[10px] text-amber-700 font-semibold">CCTNS Hit</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Tower Pings</span>
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{metrics.towerPings}</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Triangulated</div>
            </div>

            <div className="rounded-xl border border-red-200 p-3 shadow-xs flex flex-col justify-between bg-red-50/30">
              <div className="flex items-center justify-between text-red-700 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Shell Accts</span>
                <Building2 className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-600 mt-1">{metrics.shellAccounts}</div>
              <div className="text-[10px] text-red-600 font-semibold">Flagged FIU-IND</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Suspect Links</span>
                <Users className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{metrics.suspectLinks}</div>
              <div className="text-[10px] text-purple-600 font-semibold">Graph Edges</div>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span>SYSTEM PROCESSING LOG — SECURE TERMINAL</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="flex-1 bg-slate-50/90 rounded-lg border border-slate-200 p-3 font-mono text-[11px] leading-relaxed space-y-2 max-h-65 overflow-y-auto">
              {modules.map((module) => (
                <div key={module.id} className="flex items-start justify-between gap-2">
                  <span className="text-slate-700">{`[${module.id}] ${module.label}`}</span>
                  <span className="text-emerald-700 font-bold shrink-0">{getDisplayStatus(module)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-1.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Overall Analysis Progress</span>
                <span className="text-amber-600 font-black text-sm">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <Link
              href="/review"
              className="w-full mt-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white bg-[#0c162c] hover:bg-[#152342] font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>View Tactical Dashboard &amp; Intelligence Summary</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}