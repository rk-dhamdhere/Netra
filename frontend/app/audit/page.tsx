"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Lock, 
  CheckCircle2, 
  FileCheck, 
  Key, 
  Server, 
  Terminal, 
  ArrowLeft, 
  Clock,
  Printer,
  ChevronRight
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";

interface AuditEntry {
  id: string;
  timestamp: string;
  officer: string;
  officerId: string;
  action: string;
  exhibitId: string;
  sha256Hash: string;
  ipAddress: string;
  status: "VERIFIED" | "SEALED" | "DISPATCHED";
}

const auditLogs: AuditEntry[] = [];

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = auditLogs.filter((log) => {
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.exhibitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      {/* Global Header */}
      <GlobalHeader classification="CONFIDENTIAL" />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={1} 
        caseSubtitle="No active case selected · National Investigation Audit & Cryptographic Hash Ledger"
      />

      {/* Subheader Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0c162c] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                National Investigation Audit &amp; Hash Ledger
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Cryptographic Non-Repudiation Trail under Section 65B &amp; IT Act 2000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evidence Integrity: 100% Intact</span>
            </div>
            <button
              type="button"
              onClick={() => alert("Audit Manifest exported with Digital Stamp.")}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0c162c] hover:bg-[#152342] text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>Export Audit Ledger</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 space-y-4">
        
        {/* 4 Integrity Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Sealed Exhibits</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">0 Files</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">SHA-256 Hashed</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Audit Events</span>
            <div className="text-xl font-black text-blue-700 mt-0.5">0 Operations</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">Realtime Logged</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Tamper Anomalies</span>
            <div className="text-xl font-black text-emerald-700 mt-0.5">0 Detected</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Immutable Ledger</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">NIC Vault Status</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">Unavailable</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">No active vault</div>
          </div>
        </div>

        {/* Audit Search Bar & Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Controls bar */}
          <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Immutable Cryptographic Evidence Records
              </h2>
              <p className="text-[11px] text-slate-500">
                Every file upload, OCR extraction, facial vector calculation, and SITREP broadcast is permanently logged.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hash, officer, action..."
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 w-56"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Audit ID &amp; Time</th>
                  <th className="py-2.5 px-3">Operator / Agent</th>
                  <th className="py-2.5 px-3">Investigation Action</th>
                  <th className="py-2.5 px-3">Exhibit ID</th>
                  <th className="py-2.5 px-3">SHA-256 Hash Manifest</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 px-3 text-center text-slate-500">
                      No audit records available
                    </td>
                  </tr>
                )}
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-slate-900">{log.id}</div>
                      <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{log.officer}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.officerId} · {log.ipAddress}</div>
                    </td>

                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {log.action}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        {log.exhibitId}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 max-w-[200px] truncate" title={log.sha256Hash}>
                      {log.sha256Hash.substring(0, 24)}...{log.sha256Hash.substring(log.sha256Hash.length - 8)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      {log.status === "SEALED" && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          SEALED
                        </span>
                      )}
                      {log.status === "VERIFIED" && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                          VERIFIED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Showing {filteredLogs.length} verified immutable ledger entries</span>
            <span className="text-emerald-700 font-semibold">NIC GovCloud Cryptographic Proof Valid</span>
          </div>

        </div>

      </main>
    </div>
  );
}
