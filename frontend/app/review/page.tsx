"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  Share2, 
  MapPin, 
  FileText, 
  Sparkles, 
  Check, 
  Camera, 
  Download, 
  ExternalLink, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  FileDown, 
  Edit3, 
  Flag, 
  Layers,
  Network,
  Radio,
  SlidersHorizontal,
  ChevronLeft,
  X,
  AlertTriangle,
  Building2,
  Phone,
  Car,
  Printer
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import { NetraTargetIcon } from "../../components/NetraLogo";
import NetworkGraph from "../../components/NetworkGraph";
import StepperNav from "../../components/StepperNav";
import dynamic from "next/dynamic";

const LiveHeatmap = dynamic(() => import("../../components/LiveHeatmap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span>Initializing Leaflet Tactical Basemap...</span>
      </div>
    </div>
  ),
});

const evidenceSlides = [
  ["05-04-2024 Sat 20:17:35", "CAM-42", "94%", "#TGT-1193", "2026-09-02 14:32:11 · Andheri East", "Camera 03", "CCTV-Cam-42", "2026-09-02 14:32"],
  ["05-04-2024 Sat 20:19:08", "CAM-42", "91%", "#TGT-1193", "2026-09-02 14:34:06 · Andheri East", "Camera 03", "CCTV-Cam-42", "2026-09-02 14:34"],
  ["05-04-2024 Sat 20:21:42", "CAM-42", "89%", "#TGT-1193", "2026-09-02 14:36:40 · Andheri East", "Camera 03", "CCTV-Cam-42", "2026-09-02 14:36"],
  ["05-04-2024 Sat 20:24:17", "CAM-42", "86%", "#TGT-1193", "2026-09-02 14:39:15 · Andheri East", "Camera 03", "CCTV-Cam-42", "2026-09-02 14:39"],
] as const;

export default function EvidenceReviewPage() {
  const [activeModule, setActiveModule] = useState<"suspects" | "graph" | "geo" | "dossier" | "cross">("suspects");
  const [currentSlide, setCurrentSlide] = useState(1);
  const [approved, setApproved] = useState(false);
  const [showSec65BModal, setShowSec65BModal] = useState(false);
  const [showSitrepModal, setShowSitrepModal] = useState(false);
  const currentEvidence = evidenceSlides[currentSlide - 1];

  const scrollToSection = (sectionId: "suspects" | "graph" | "geo" | "dossier" | "cross") => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const sections = ["suspects", "graph", "geo", "dossier", "cross"]
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveModule(visibleSection.target.id as typeof activeModule);
        }
      },
      { rootMargin: "-120px 0px -55%", threshold: [0.1, 0.35, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800 relative">
      {/* Global Header */}
      <GlobalHeader 
        caseId="Case FIR-2026-08417" 
        classification="CONFIDENTIAL" 
      />

      {/* Shared NETRA Workflow Navigation */}
      <StepperNav 
        currentStep={5} 
        caseSubtitle="Case FIR-2026-08417 · Multi-Agency AI Tactical Intelligence Graph" 
      />

      {/* Subheader Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0c162c] text-white flex items-center justify-center shadow-xs">
              <NetraTargetIcon className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                Evidence Review &amp; AI Case Summary
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Build Screen 5 · Verify exhibits, confirm extracted entities, approve SITREP for field team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Custody: Sealed</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-2xs font-bold">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Risk Score: 87 — High</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace Grid */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 space-y-4">
        
        {/* Top Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* LEFT SIDEBAR: Investigation Modules */}
          <div className="lg:col-span-3 lg:sticky lg:top-4 lg:self-start flex flex-col justify-between space-y-3">
            
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  INVESTIGATION MODULES
                </span>
                <span className="text-xs font-bold text-slate-700 font-mono">
                  Case FIR-2026-08417
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {/* 1. Suspects by Risk */}
                <button
                  type="button"
                  onClick={() => scrollToSection("suspects")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === "suspects"
                      ? "bg-[#0c162c] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className={`w-4 h-4 ${activeModule === "suspects" ? "text-blue-400" : "text-slate-600"}`} />
                    <div>
                      <div className="leading-tight">Suspects — by Risk</div>
                      <div className={`text-[10px] ${activeModule === "suspects" ? "text-slate-300" : "text-slate-400"}`}>
                        14 flagged
                      </div>
                    </div>
                  </div>
                  {activeModule === "suspects" ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {/* 2. Network Knowledge Graph */}
                <button
                  type="button"
                  onClick={() => scrollToSection("graph")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === "graph"
                      ? "bg-[#0c162c] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Network className={`w-4 h-4 ${activeModule === "graph" ? "text-indigo-300" : "text-indigo-600"}`} />
                    <div>
                      <div className="leading-tight">Network Knowledge Graph</div>
                      <div className={`text-[10px] ${activeModule === "graph" ? "text-slate-300" : "text-slate-400"}`}>
                        86 nodes · Interactive
                      </div>
                    </div>
                  </div>
                  {activeModule === "graph" ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {/* 3. Geospatial Hotspot Map */}
                <button
                  type="button"
                  onClick={() => scrollToSection("geo")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === "geo"
                      ? "bg-[#0c162c] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${activeModule === "geo" ? "text-amber-300" : "text-amber-600"}`} />
                    <div>
                      <div className="leading-tight">Geospatial Hotspot Map</div>
                      <div className={`text-[10px] ${activeModule === "geo" ? "text-slate-300" : "text-slate-400"}`}>
                        Andheri E &amp; Sadar Bazar
                      </div>
                    </div>
                  </div>
                  {activeModule === "geo" ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {/* 4. AI Intelligence Dossier */}
                <button
                  type="button"
                  onClick={() => scrollToSection("dossier")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === "dossier"
                      ? "bg-[#0c162c] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${activeModule === "dossier" ? "text-emerald-300" : "text-emerald-600"}`} />
                    <div>
                      <div className="leading-tight">AI Intelligence Dossier</div>
                      <div className={`text-[10px] ${activeModule === "dossier" ? "text-slate-300" : "text-slate-400"}`}>
                        Updated 2h ago
                      </div>
                    </div>
                  </div>
                  {activeModule === "dossier" ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {/* 5. Cross Case Intelligence */}
                <button
                  type="button"
                  onClick={() => scrollToSection("cross")}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeModule === "cross"
                      ? "bg-[#0c162c] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Share2 className={`w-4 h-4 ${activeModule === "cross" ? "text-teal-300" : "text-teal-600"}`} />
                    <div>
                      <div className="leading-tight">Cross Case Intelligence</div>
                      <div className={`text-[10px] ${activeModule === "cross" ? "text-slate-300" : "text-slate-400"}`}>
                        3 Linkages
                      </div>
                    </div>
                  </div>
                  {activeModule === "cross" ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

              </div>

            </div>

            {/* Chain of Custody Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chain of Custody</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                4 exhibits sealed · Hash verified · Sec 65B ready
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>

          </div>

          {/* DYNAMIC CENTER & RIGHT PANELS BASED ON SELECTED MODULE */}

          <div className="lg:col-span-9 space-y-4">
            <section id="suspects" className="scroll-mt-32 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">Primary Suspect Evidence</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold border border-slate-200">
                    Exhibit A-04
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Exhibit A-04 exported with SHA-256 Hash Manifest")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export Media</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)]">
                <div className="border-b lg:border-b-0 lg:border-r border-slate-200 p-3.5 sm:p-4">
                  <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 aspect-16/10 flex flex-col justify-between p-3 select-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-black/80 pointer-events-none" />
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                    
                    <div className="absolute bottom-6 right-6 w-36 h-24 bg-slate-800/80 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center text-[10px] font-mono text-slate-400">
                      <div className="w-12 h-6 bg-amber-500/20 rounded-t border border-amber-500/40 mb-1" />
                      <span>Auto MH-02</span>
                    </div>

                    <div className="absolute bottom-10 left-6 w-24 h-16 bg-slate-800/60 rounded border border-slate-700/40 flex items-center justify-center text-[9px] font-mono text-slate-500">
                      Market Stall
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/90">
                      <span className="font-semibold">{currentEvidence[0]}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-red-500 font-bold bg-black/60 px-1.5 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          REC
                        </span>
                        <span className="bg-black/60 px-1.5 py-0.5 rounded font-bold text-slate-300">
                          {currentEvidence[1]}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-20 mx-auto my-auto w-28 sm:w-32 h-36 sm:h-40 border-2 border-emerald-400 bg-emerald-500/10 rounded-sm flex flex-col justify-between p-1 shadow-lg shadow-emerald-500/20">
                      <div className="self-start -mt-3.5 -ml-1 bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-xs shadow-xs uppercase tracking-tight flex items-center gap-1">
                        <span>AI Facial Match: {currentEvidence[2]}</span>
                      </div>

                      <div className="w-full flex-1 flex flex-col items-center justify-center opacity-85">
                        <div className="w-7 h-7 rounded-full bg-slate-400 border border-slate-300 shadow-xs" />
                        <div className="w-14 h-20 bg-slate-600 rounded-t-lg mt-1 border border-slate-500" />
                      </div>

                      <div className="text-[8px] font-mono text-emerald-300 text-right self-end bg-black/70 px-1 rounded">
                        ID: {currentEvidence[3]}
                      </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/80">
                      <span className="bg-black/60 px-1.5 py-0.5 rounded">
                        {currentEvidence[4]}
                      </span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded">
                        {currentEvidence[5]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 font-semibold">
                      {evidenceSlides.map((_, index) => (
                        <span
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentSlide - 1 ? "bg-slate-800" : "bg-slate-300"}`}
                        />
                      ))}
                      <span className="ml-2">{currentSlide} / {evidenceSlides.length}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentSlide(Math.min(4, currentSlide + 1))}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Source: {currentEvidence[6]} | Timestamp: {currentEvidence[7]}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>Hash OK</span>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                        <h2 className="text-xs font-bold text-slate-900">Data Extracted from Ingestion</h2>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pb-1 border-b border-slate-50">
                      <span>Entity ID: ENT-2026-1193 · Confidence 96.2%</span>
                      <span className="font-semibold text-blue-600">5 sources</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Legal Name</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>Vikram alias Vicky</span>
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Aadhaar / PAN Match</span>
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800">
                          <span>XXXX-XXXX-4921</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Primary IMEI / IMSI</span>
                        <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800">
                          <span>86392004XXXXX</span>
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Last Cell Tower Ping</span>
                        <span className="font-semibold text-slate-900">Cell-ID: 40291 (Andheri East)</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Associated Vehicles</span>
                        <span className="font-semibold text-slate-900">MH-02-AB-1234 (White Honda)</span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">FIR Linkages</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>3 FIRs · 2 States</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] leading-snug text-emerald-900 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                    <span>
                      Aadhaar + IMEI cross-matched with CDR dump · Tower ping within 400m of Exhibit A-04
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section id="graph" className="scroll-mt-32 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Multi-Agency AI Knowledge Graph Visualization</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                    86 Entities Linked
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">Drag to pan · Scroll to zoom</div>
              </div>
              
              <div className="w-full h-[360px]">
                <NetworkGraph />
              </div>
            </section>

            <section id="geo" className="scroll-mt-32 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900">Geospatial Hotspot Map &amp; Cell Tower Clusters</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                    8,419 Pings Plotted
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Accuracy: 25m Radius · Tactical Dark Grid</span>
              </div>

              {/* Live Tactical Leaflet Heatmap */}
              <div className="w-full">
                <LiveHeatmap />
              </div>
            </section>

            <section id="dossier" className="scroll-mt-32 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">AI Intelligence Dossier &amp; Chronological Timeline</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Comprehensive Audit
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>08 Jan 2024 · 06:14 IST</span>
                    <span className="text-blue-600">Surveillance Log</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Vehicle DL-3C-AB-9214 spotted at Sadar Bazar drop location. IMEI 86392004XXXXX registered on tower DEL-40291.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>10 Jan 2024 · 14:32 IST</span>
                    <span className="text-amber-600">Financial Intercept</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    FIU-IND alert triggered: ₹47.3 Lakhs transferred in 14 micro-bursts across 9 shell accounts within 40 minutes.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>12 Jan 2024 · 20:17 IST</span>
                    <span className="text-red-600">CCTV Facial Verification</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Exhibit A-04 captured at Andheri East market. AI facial matching confirms 94% vector alignment with suspect Vikram alias Vicky.
                  </p>
                </div>
              </div>
            </section>

            <section id="cross" className="scroll-mt-32 bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-900">Cross Case Syndicate Linkage Matrix</span>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  3 FIRs Connected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">FIR/001/2024/DL</div>
                  <div className="text-[10px] text-slate-500">Delhi Special Cell</div>
                  <div className="mt-2 text-xs text-slate-700">Primary Hawala Nexus &amp; SIM Onboarding loop.</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">FIR-2026-08417</div>
                  <div className="text-[10px] text-slate-500">Mumbai Crime Branch</div>
                  <div className="mt-2 text-xs text-slate-700">Cash drop &amp; mule account distribution cluster.</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">FIR/112/2024/KA</div>
                  <div className="text-[10px] text-slate-500">Bengaluru CCB</div>
                  <div className="mt-2 text-xs text-slate-700">VoIP international proxy gateway controller.</div>
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* BOTTOM SPANNING CARD: Automated Case Intelligence Summary */}
        <section id="summary" className="scroll-mt-32 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          
          <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                  Automated Case Intelligence Summary
                </h2>
                <p className="text-[10px] text-slate-600 font-medium">
                  Generated by GraphAI v4.2 · Model confidence 91% · 12 FIRs + CDR + CCTV fused
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSec65BModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Generate Sec 65B PDF Report</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-3.5 text-xs text-slate-700 leading-relaxed">
            <p>
              <strong className="text-slate-900 font-bold">Modus Operandi (MO):</strong>{" "}
              Subject operates a layered hawala ring across Andheri–Kurla corridor. FIRs 08417, 07902 and 07155 show identical pattern: SIM-swap onboarding via forged Aadhaar e-KYC, followed by sub-₹50,000 UPI bursts to 14 mule accounts within 40 minutes of tower ping at Cell-ID 40291. CCTV-Cam-42 places subject at cash handoff point 22 minutes before fund dispersal.
            </p>

            <p>
              <strong className="text-slate-900 font-bold">Network Hierarchy:</strong>{" "}
              Graph centrality (betweenness 0.78) positions Vikram alias Vicky as mid-level money launderer reporting to handler node ENT-1188 (&quot;Salim Bhai&quot;). Financial logs show ₹47.3L routed through his IMEI-linked wallets in 60 days; 3 downstream mules and 1 vehicle (MH-02-AB-1234) are exclusively tied to his cluster. No direct link to top-tier controller yet.
            </p>

            <p>
              <strong className="text-slate-900 font-bold">Recommended Action:</strong>{" "}
              Detain for interrogation under Sec 41A CrPC within 48 hrs; prioritise CDR triangulation of associates ENT-1194 and ENT-1201. Freeze mule accounts flagged in linkage L-33. Forward Exhibit A-04 + hash manifest to FSL Kalina for Sec 65B certification before filing remand application.
            </p>
          </div>

          <div className="bg-slate-50/70 border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-500 mr-1">Analyst:</span>
              
              <button
                type="button"
                onClick={() => setApproved(!approved)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-bold border transition-colors cursor-pointer ${
                  approved
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                    : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border-slate-300"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{approved ? "Approved" : "Approve"}</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Editor brief unlocked for Investigating Officer annotations.")}
                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-slate-500" />
                <span>Edit brief</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Case flagged for Superintendent of Police (SP) Priority Review.")}
                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
              >
                <Flag className="w-3 h-3 text-slate-500" />
                <span>Flag for SP review</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              Audit-logged · e-Signed draft pending
            </span>
          </div>

        </section>

        {/* Global Bottom Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-500">
            All actions audit-logged under IT Act 2000 · Access: IPS / SP rank and above
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/processing"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Back to Risk Scoring
            </Link>

            <Link
              href="/intel"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0c162c] hover:bg-[#152342] text-white font-bold shadow-md shadow-slate-900/20 transition-all cursor-pointer"
            >
              <span>Push to Field Intel Update</span>
              <span className="text-blue-400">⇪</span>
            </Link>
          </div>
        </div>

      </main>

      {/* MODAL 1: Sec 65B Electronic Evidence Certificate Preview */}
      {showSec65BModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Section 65B Indian Evidence Act Certificate Preview
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSec65BModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs font-serif leading-relaxed text-slate-800 space-y-2">
              <div className="text-center font-bold text-slate-900 uppercase">
                GOVERNMENT OF INDIA • FORENSIC SCIENCE LABORATORY
              </div>
              <p>
                I, Insp. Rajesh Sharma, IPS (Badge #IN-9842), hereby certify under Section 65B of the Indian Evidence Act, 1872 that Exhibit A-04 (CCTV-Cam-42 footage hash SHA256: 8f9b2...e4a) and CDR Matrix (35,640 records) were produced by digital systems operating under regular lawful custody without alteration or compromise.
              </p>
              <div className="pt-2 flex justify-between font-mono text-[11px] text-slate-600 border-t border-slate-200">
                <span>Hash: SHA-256 Verified</span>
                <span>Digitally Signed: 2026-09-08 00:30 IST</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSec65BModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Sec 65B Certificate generated and sent to FSL & CCTNS portal.");
                  setShowSec65BModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#0c162c] text-white text-xs font-bold hover:bg-[#152342] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export &amp; Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Field Intel Update / SITREP Dispatch Modal */}
      {showSitrepModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900">
                  Field Tactical SITREP Broadcast Confirmation
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowSitrepModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p>
                Dispatching tactical operational alert to <strong>Field Special Operations Group (Mumbai &amp; Delhi NCR)</strong> for target <strong>Vikram alias Vicky</strong>.
              </p>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                ✓ Live Cell-ID triangulation (Andheri East) attached<br />
                ✓ Vehicle DL-3C-AB-9214 APPR notice broadcasted<br />
                ✓ Remand arrest authorization approved under Sec 41A CrPC
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSitrepModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("SITREP successfully broadcasted to Field Intercept Units!");
                  setShowSitrepModal(false);
                }}
                className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Confirm Dispatch to Field Team</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function FileCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
