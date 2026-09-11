"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Users, 
  Activity, 
  Lock, 
  PhoneCall, 
  Building2, 
  Camera, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";

interface CaseItem {
  firNumber: string;
  jurisdiction: string;
  targetName: string;
  alias: string;
  sections: string[];
  riskScore: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  intelSources: string[];
  status: string;
  statusColor: string;
  lastUpdated: string;
}

const casesData: CaseItem[] = [];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");

  const filteredCases = casesData.filter((c) => {
    const matchesSearch =
      c.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === "ALL" || c.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Global Header */}
      <GlobalHeader classification="CONFIDENTIAL" />

      {/* Stepper Navigation */}
      <StepperNav currentStep={1} caseSubtitle="Step 1 of 6 · Officer Tactical Command & Case Ingestion" />

      {/* Main Container */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-6 space-y-4">
        
        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column: Sidebar Stats & Officer Dossier (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Officer Security Clearance Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <Link
                href="/docket"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0c162c] hover:bg-[#152342] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-400" />
                <span>Create New Case Docket</span>
              </Link>
            </div>

            {/* Quick Metrics Stack */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              
              {/* Active Cases */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Active Dockets</span>
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">0</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <span>No new dockets</span>
                </div>
              </div>

              {/* Suspects Tracked */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Tracked Entities</span>
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">0</div>
                <div className="text-[10px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <span>No priority entities</span>
                </div>
              </div>

              {/* Total Arrests */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Arrests Sealed</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">0</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  No conviction data
                </div>
              </div>

              {/* Flagged Financials */}
              <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                  <span>Flagged FININT</span>
                  <Activity className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-slate-900">₹0</div>
                <div className="text-[10px] text-amber-600 font-semibold mt-1">
                  No flagged accounts
                </div>
              </div>

            </div>

            {/* Quick Navigation Cards */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Rapid Access Modules
              </div>

              <Link
                href="/docket"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">2</span>
                  <span>Case Metadata &amp; Text Ingestion</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/custody"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[11px]">3</span>
                  <span>Chain of Custody &amp; Evidence Staging</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/processing"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">4</span>
                  <span>NCRB Multi-Agency AI Engine</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/review"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 transition-colors text-xs font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">6</span>
                  <span>AI Case Dossier &amp; Evidence Review</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

          </div>

          {/* Right Column: Main Case Operations Table (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* Table Control Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>Active Investigation Dockets &amp; Intelligence Matrix</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {filteredCases.length} Operations
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cross-referenced with CCTNS, NATGRID, FIU-IND, and Telecom CDR database
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex items-center gap-2 flex-wrap xl:justify-end">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FIR, Suspect, Section..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white w-48"
                  />
                </div>

                {/* Risk Filter Buttons */}
                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px]">
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFilterRisk(lvl)}
                      className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                        filterRisk === lvl
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Cases Table Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-3.5">Case Docket &amp; FIR</th>
                      <th className="py-3 px-3.5">Primary Target</th>
                      <th className="py-3 px-3.5">Sections Applied</th>
                      <th className="py-3 px-3.5">Risk Score</th>
                      <th className="py-3 px-3.5">Evidence Modules</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCases.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-10 px-3.5 text-center text-slate-500">
                          No active investigation dockets
                        </td>
                      </tr>
                    )}
                    {filteredCases.map((item) => {
                      return (
                        <tr
                          key={item.firNumber}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* FIR & Jurisdiction */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-900 font-mono">
                              {item.firNumber}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {item.jurisdiction}
                            </div>
                          </td>

                          {/* Target & Alias */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-800">
                              {item.targetName}
                            </div>
                            <div className="text-[10px] text-slate-500 italic">
                              "{item.alias}"
                            </div>
                          </td>

                          {/* Sections */}
                          <td className="py-3 px-3.5">
                            <div className="flex flex-wrap gap-1 max-w-[170px]">
                              {item.sections.map((sec) => (
                                <span
                                  key={sec}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                                >
                                  {sec}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Risk Score */}
                          <td className="py-3 px-3.5">
                            {item.riskLevel === "CRITICAL" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-black text-[11px] border border-red-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                                CRITICAL ({item.riskScore})
                              </span>
                            )}
                            {item.riskLevel === "HIGH" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                HIGH ({item.riskScore})
                              </span>
                            )}
                            {item.riskLevel === "MEDIUM" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                MEDIUM ({item.riskScore})
                              </span>
                            )}
                          </td>

                          {/* Intel Sources */}
                          <td className="py-3 px-3.5">
                            <div className="flex flex-col gap-0.5">
                              {item.intelSources.map((src, i) => (
                                <span key={i} className="text-[10px] text-slate-600 font-medium">
                                  • {src}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5">
                            <div className="text-[11px] font-semibold text-slate-800">
                              {item.status}
                            </div>
                            <div className="text-[9px] text-slate-400">
                              Updated {item.lastUpdated}
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3 px-3.5 text-right">
                            <Link
                              href={`/review?case=${encodeURIComponent(item.firNumber)}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 group-hover:bg-[#0c162c] text-slate-700 group-hover:text-white text-xs font-semibold border border-slate-200 group-hover:border-transparent transition-all"
                            >
                              <span>Open</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
                <span>Showing {filteredCases.length} active federal investigation dockets</span>
                <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>NIC GovCloud Live Sync Active</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
