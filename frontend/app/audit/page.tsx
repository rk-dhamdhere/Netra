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

const auditLogs: AuditEntry[] = [
  {
    id: "AUD-9821",
    timestamp: "2026-09-08 00:39:14 IST",
    officer: "Insp. Rajesh Sharma",
    officerId: "IN-9842",
    action: "Generated & Digitally Signed Sec 65B Certificate",
    exhibitId: "EX-65B-CERT-01",
    sha256Hash: "8f9b2d3e4a5c6b7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
    ipAddress: "10.142.12.90 (NIC-VPN)",
    status: "SEALED",
  },
  {
    id: "AUD-9820",
    timestamp: "2026-09-08 00:36:12 IST",
    officer: "System AI Engine",
    officerId: "SYS-AUTO",
    action: "ANPR Plate Match MH-02-AB-1234 (98.6% Conf)",
    exhibitId: "ANPR-CAM-09",
    sha256Hash: "4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    ipAddress: "10.142.18.45 (Gateway)",
    status: "VERIFIED",
  },
  {
    id: "AUD-9819",
    timestamp: "2026-09-08 00:25:01 IST",
    officer: "System AI Engine",
    officerId: "SYS-AUTO",
    action: "AI Facial Vector Match 94% on Exhibit A-04",
    exhibitId: "CCTV-Cam-42",
    sha256Hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    ipAddress: "10.142.18.45 (Gateway)",
    status: "VERIFIED",
  },
  {
    id: "AUD-9818",
    timestamp: "2026-09-08 00:18:44 IST",
    officer: "Insp. Rajesh Sharma",
    officerId: "IN-9842",
    action: "Locked 4-Quadrant Evidence Staging to Vault",
    exhibitId: "CUS-2024-001-A",
    sha256Hash: "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    ipAddress: "10.142.12.90 (NIC-VPN)",
    status: "SEALED",
  },
  {
    id: "AUD-9817",
    timestamp: "2026-09-08 00:15:30 IST",
    officer: "System AI Engine",
    officerId: "SYS-AUTO",
    action: "OCR & Named Entity Extraction (14 entities mapped)",
    exhibitId: "FIR_DL_001_2024",
    sha256Hash: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    ipAddress: "10.142.18.45 (Gateway)",
    status: "VERIFIED",
  },
  {
    id: "AUD-9816",
    timestamp: "2026-09-08 00:09:20 IST",
    officer: "Insp. Rajesh Sharma",
    officerId: "IN-9842",
    action: "Terminal Session Authenticated (Level-4 SCI Clearance)",
    exhibitId: "AUTH-LOGIN",
    sha256Hash: "5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e",
    ipAddress: "10.142.12.90 (NIC-VPN)",
    status: "VERIFIED",
  },
];

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
        caseSubtitle="Case CID-2024-001 · National Investigation Audit & Cryptographic Hash Ledger" 
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
            <div className="text-xl font-black text-slate-900 mt-0.5">17 Files</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">SHA-256 Hashed</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Audit Events</span>
            <div className="text-xl font-black text-blue-700 mt-0.5">42 Operations</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">Realtime Logged</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">Tamper Anomalies</span>
            <div className="text-xl font-black text-emerald-700 mt-0.5">0 Detected</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Immutable Ledger</div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500">NIC Vault Status</span>
            <div className="text-xl font-black text-slate-900 mt-0.5">Online</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">DEL-SRV-09</div>
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
