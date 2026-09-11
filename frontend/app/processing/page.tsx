"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
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
  Compass,
  FileText
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

const STORAGE_KEY = "netra-processing-state-v1";

const INITIAL_MODULES: ModuleState[] = [];

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
  const completed = modules.filter((module) => module.status === "COMPLETED" || module.status === "RESULT").length;
  return total === 0 ? 0 : Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
}

function formatEta(progress: number): string {
  if (progress >= 100) return "Completed";
  const seconds = Math.max(5, Math.round((100 - progress) * 4.5));
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `~${remainingSeconds} seconds`;
  return `~${minutes} minute${minutes === 1 ? "" : "s"} ${remainingSeconds} seconds`;
}

export default function AIProcessingPage() {
  const [bearing, setBearing] = useState(42);
  const [modules, setModules] = useState<ModuleState[]>(INITIAL_MODULES);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ModuleState[];
        if (Array.isArray(parsed) && parsed.length) {
          setModules(parsed);
        }
      }
    } catch {
      // Ignore invalid storage state and keep default pipeline values.
    }
  }, []);

  const progress = calculateProgress(modules);
  const completedCount = modules.filter((module) => module.status === "COMPLETED" || module.status === "RESULT").length;
  const isComplete = modules.length === 0 || modules.every((module) => module.status === "COMPLETED" || module.status === "RESULT");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
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
          const nextProgress = Math.min(100, activeModule.progress + 6);
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
              nextModules[nextPendingIndex].progress = Math.max(1, nextModules[nextPendingIndex].progress);
            }
          }

          return nextModules;
        }

        const pendingIndex = nextModules.findIndex((module) => module.status === "PENDING");
        if (pendingIndex === -1) {
          return nextModules;
        }

        nextModules[pendingIndex].status = "PROCESSING";
        nextModules[pendingIndex].progress = 1;
        return nextModules;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col antialiased">
      
      {/* Global Header */}
      <GlobalHeader 
        caseId=""
        classification="CONFIDENTIAL" 
      />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={4} 
        caseSubtitle="No active case selected · Multi-Agency AI Tactical Processing Engine"
      />

      {/* White Subheader / Tactical Bar */}
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

          {/* Telemetry Status Chips */}
          <div className="flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]">
              <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
              <span>BEARING: {bearing.toString().padStart(3, "0")}° TRUE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>0 NODES LOCKED</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[11px]">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>AES-256 GCM</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Fullscreen Light Workspace */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* LEFT & CENTER: Enhanced Tactical Radar Scanner (7 Cols) */}
        <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-col justify-between relative">
          
          {/* Radar Header */}
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

          {/* Large Enhanced Radar Display */}
          <div className="my-5 flex items-center justify-center">
            
            {/* Tactical High-Contrast Radar Housing Screen */}
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border-4 border-slate-200 bg-[#070e1c] shadow-xl flex items-center justify-center overflow-hidden select-none">
              
              {/* Outer Azimuth Degree Numbers */}
              <div className="absolute top-2 font-mono text-[9px] font-bold text-cyan-400">000° N</div>
              <div className="absolute bottom-2 font-mono text-[9px] font-bold text-cyan-400">180° S</div>
              <div className="absolute right-2 font-mono text-[9px] font-bold text-cyan-400">090° E</div>
              <div className="absolute left-2 font-mono text-[9px] font-bold text-cyan-400">270° W</div>

              {/* Concentric Range Rings */}
              <div className="absolute w-[85%] h-[85%] rounded-full border border-cyan-500/20 border-dashed" />
              <div className="absolute w-[65%] h-[65%] rounded-full border border-cyan-500/25" />
              <div className="absolute w-[45%] h-[45%] rounded-full border border-cyan-500/20 border-dashed" />
              <div className="absolute w-[25%] h-[25%] rounded-full border border-cyan-500/30" />
              <div className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />

              {/* Distance Markings */}
              <span className="absolute top-[18%] right-[52%] font-mono text-[8px] text-cyan-400/70">25 KM</span>
              <span className="absolute top-[28%] right-[52%] font-mono text-[8px] text-cyan-400/70">15 KM</span>
              <span className="absolute top-[38%] right-[52%] font-mono text-[8px] text-cyan-400/70">5 KM</span>

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/30" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/30" />
              <div className="absolute w-full h-px bg-cyan-500/15 rotate-45" />
              <div className="absolute w-full h-px bg-cyan-500/15 -rotate-45" />

              {/* Rotating Sweep Beam */}
              <div 
                className="absolute inset-0 rounded-full origin-center animate-spin pointer-events-none"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(6, 182, 212, 0.05) 300deg, rgba(6, 182, 212, 0.45) 360deg)",
                  animationDuration: "3.5s",
                  animationTimingFunction: "linear"
                }}
              />

              {/* Laser Leading Edge Line */}
              <div 
                className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-t from-transparent via-cyan-300 to-white shadow-[0_0_12px_#22d3ee] origin-bottom animate-spin pointer-events-none"
                style={{
                  animationDuration: "3.5s",
                  animationTimingFunction: "linear"
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-300">
                No tracking data available
              </div>

            </div>

          </div>

          {/* Radar Telemetry Information Grid */}
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
              <span className="text-emerald-700 font-bold text-xs mt-0.5">No data</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
              <span className="text-[10px] font-semibold text-slate-500">SECURITY PROTOCOL</span>
              <span className="text-blue-700 font-bold text-xs mt-0.5">TLS 1.3 / AES-GCM</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 6 Stat Cards & System Processing Terminal (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* 6 Key Intelligence Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            
            {/* 1. Entities Extracted */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Entities</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">0</div>
              <div className="text-[10px] text-slate-500 font-semibold">No data</div>
            </div>

            {/* 2. CDR Records */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">CDR Logs</span>
                <Phone className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">0</div>
              <div className="text-[10px] text-slate-500 font-semibold">No files ingested</div>
            </div>

            {/* 3. Facial Matches */}
            <div className="bg-white rounded-xl border border-amber-200 p-3 shadow-xs flex flex-col justify-between bg-amber-50/30">
              <div className="flex items-center justify-between text-amber-700 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Facial Match</span>
                <Camera className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600 mt-1">0</div>
              <div className="text-[10px] text-slate-500 font-semibold">No matches</div>
            </div>

            {/* 4. Cell Tower Pings */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Tower Pings</span>
                <Radio className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">0</div>
              <div className="text-[10px] text-slate-500 font-semibold">No pings</div>
            </div>

            {/* 5. Shell Accounts */}
            <div className="bg-white rounded-xl border border-red-200 p-3 shadow-xs flex flex-col justify-between bg-red-50/30">
              <div className="flex items-center justify-between text-red-700 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Shell Accts</span>
                <Building2 className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div className="text-2xl font-black text-red-600 mt-1">0</div>
              <div className="text-[10px] text-slate-500 font-semibold">No flagged accounts</div>
            </div>

            {/* 6. Suspect Links */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="text-[10px] uppercase font-bold tracking-wide">Suspect Links</span>
                <Users className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">0</div>
              <div className="text-[10px] text-slate-500 font-semibold">No links</div>
            </div>

          </div>

          {/* System Terminal Console */}
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

            {/* Terminal output lines */}
            <div className="flex-1 bg-slate-50/90 rounded-lg border border-slate-200 p-3 font-mono text-[11px] leading-relaxed space-y-2 max-h-[260px] overflow-y-auto">
              {modules.map((module) => {
                const labelClass =
                  module.status === "PENDING"
                    ? "text-slate-400"
                    : module.status === "PROCESSING"
                    ? "text-blue-900 font-medium"
                    : module.status === "RESULT"
                    ? "text-slate-800 font-medium"
                    : "text-slate-600";

                const statusClass =
                  module.status === "PENDING"
                    ? "text-slate-400"
                    : module.status === "PROCESSING"
                    ? "text-amber-700 animate-pulse"
                    : module.status === "RESULT"
                    ? "text-amber-700 font-bold"
                    : "text-emerald-700 font-bold";

                return (
                  <div key={module.id} className="flex items-start justify-between gap-2">
                    <span className={labelClass}>{`[${module.id}] ${module.label}`}</span>
                    <span className={`${statusClass} shrink-0`}>
                      {getDisplayStatus(module)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Overall Progress Section */}
            <div className="pt-2 space-y-1.5 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Overall Analysis Progress</span>
                <span className="text-amber-600 font-black text-sm">{progress}%</span>
              </div>

              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{completedCount} of {modules.length} analysis modules complete</span>
                <span>ETA: {formatEta(progress)}</span>
              </div>
            </div>

            {/* Action Button */}
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
