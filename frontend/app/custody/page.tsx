"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  FileSpreadsheet, 
  FileText, 
  Building2, 
  Camera, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  HardDrive, 
  ArrowRight,
  Phone,
  Radio,
  FileCheck,
  Check,
  Clock,
  UserPlus
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";
import { API_BASE_URL, parseApiError } from "../../lib/api";

export default function ChainOfCustodyPage() {
  const [operator, setOperator] = useState("");
  const [warrantNo, setWarrantNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [telecomFiles, setTelecomFiles] = useState<File[]>([]);
  const [financialFiles, setFinancialFiles] = useState<File[]>([]);
  const [mugshotFile, setMugshotFile] = useState<File | null>(null);
  const [mugshotState, setMugshotState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [mugshotMessage, setMugshotMessage] = useState("");

  const handleMugshotUpload = async (file: File | undefined) => {
    if (!file) return;
    setMugshotFile(file);
    setMugshotState("processing");
    setMugshotMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("suspect_id", "suspect_primary");
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/process-mugshot`, { method: "POST", body: formData });
      if (!response.ok) throw new Error(await parseApiError(response));
      const result = await response.json();
      setMugshotState("success");
      setMugshotMessage(result.message || "Mugshot processed successfully.");
    } catch (error) {
      setMugshotState("error");
      setMugshotMessage(error instanceof Error ? error.message : "Mugshot processing failed.");
    }
  };

  const moduleCount = 5;
  const completedModules = [telecomFiles.length > 0, financialFiles.length > 0, Boolean(mugshotFile)]
    .filter(Boolean).length;
  const progress = Math.round((completedModules / moduleCount) * 100);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      {/* Global Header */}
      <GlobalHeader classification="CONFIDENTIAL" />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={3} 
        caseSubtitle="No active case selected · Evidence Vault"
      />

      {/* Subheader with Evidence Progress */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1920px] mx-auto space-y-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#0c162c] text-white flex items-center justify-center shadow-xs">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">
                  Chain of Custody &amp; Evidence Staging
                </h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  No active case selected · Step 3 of 6 · All uploads encrypted via NIC SecureVault
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Evidence Integrity: No data</span>
              </div>
              <div className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-[11px]">
                No custody record selected
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 pt-0.5 text-xs text-slate-600 font-medium">
            <span className="shrink-0 text-[11px] font-semibold text-slate-700">Evidence Upload Progress:</span>
            <div className="w-48 sm:w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#0c162c] rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-[11px] font-bold text-slate-800">{progress}%</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">— {completedModules} of {moduleCount} modules complete</span>
          </div>

        </div>
      </div>

      {/* Main 4-Quadrant Grid */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* QUADRANT 1: TOP LEFT — Telecom Intelligence (CDR) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-900 text-white flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Telecom Intelligence (CDR)</h2>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Call Detail Records · IPDR · Cell Tower Data
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded">
                  <Clock className="w-3 h-3 text-slate-500" />
                  No data
                </span>
              </div>

              {/* Uploaded CDR Files Table */}
              <div className="space-y-1.5 text-xs">
                {telecomFiles.length === 0 && <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-medium text-slate-500 text-[11px]">No CDR files uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>0 records</span>
                    <span>—</span>
                    <span>—</span>
                  </div>
                </div>}

                {telecomFiles.map((file) => <div key={file.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"><span className="font-mono font-medium text-slate-800 text-[11px]">{file.name}</span><span className="text-[11px] text-slate-500">{Math.round(file.size / 1024)} KB</span></div>)}

                {/* IPDR and tower data remain represented by the same upload state. */}
                {telecomFiles.length === 0 && <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-medium text-slate-500 text-[11px]">No IPDR files uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>0 records</span>
                    <span>—</span>
                    <span>—</span>
                  </div>
                </div>}

                {telecomFiles.length === 0 && <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-medium text-slate-500 text-[11px]">No tower data uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>0 records</span>
                    <span>—</span>
                    <span>—</span>
                  </div>
                </div>}
              </div>

              {/* Add More CDR Button */}
              <label
                className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg text-slate-600 hover:text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <input type="file" multiple className="sr-only" onChange={(event) => setTelecomFiles(Array.from(event.target.files ?? []))} />
                <Plus className="w-3.5 h-3.5" />
                <span>Add More CDR / IPDR Files</span>
              </label>

            </div>

            {/* Operator & Warrant row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  Telecom Operator
                </label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  <option value="Reliance Jio">Reliance Jio</option>
                  <option value="Bharti Airtel">Bharti Airtel</option>
                  <option value="Vodafone Idea (Vi)">Vodafone Idea (Vi)</option>
                  <option value="BSNL Federal">BSNL Federal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  Lawful Intercept Warrant
                </label>
                <input
                  type="text"
                  value={warrantNo}
                  onChange={(e) => setWarrantNo(e.target.value)}
                  className="w-full text-xs font-mono font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>

          </div>

          {/* QUADRANT 2: TOP RIGHT — Financial Intelligence (FININT) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Financial Intelligence (FININT)</h2>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Bank Statements · UPI Trails · Hawala Records
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded">
                  <Clock className="w-3 h-3 text-amber-600" />
                  No data
                </span>
              </div>

              {/* Uploaded FININT Files */}
              <div className="space-y-1.5 text-xs">
                {financialFiles.length === 0 && <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-mono font-medium text-slate-500 text-[11px]">No financial files uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500">0 files</span>
                  </div>
                </div>}

                {financialFiles.map((file) => <div key={file.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"><span className="font-mono font-medium text-slate-800 text-[11px]">{file.name}</span><span className="text-[11px] text-slate-500">{Math.round(file.size / 1024)} KB</span></div>)}

                {financialFiles.length === 0 && <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-medium text-slate-500 text-[11px]">No UPI files uploaded</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500">0 files</span>
                  </div>
                </div>}
              </div>

              {/* Drop Box */}
              <label className="border border-dashed border-amber-300 bg-amber-50/40 rounded-lg p-3 text-center flex flex-col items-center justify-center cursor-pointer">
                <input type="file" multiple className="sr-only" onChange={(event) => setFinancialFiles(Array.from(event.target.files ?? []))} />
                <UploadCloud className="w-5 h-5 text-amber-600 mb-1" />
                <div className="text-xs font-semibold text-slate-800">
                  Drop ED / FIU Reports, Bank Statements
                </div>
                <div className="text-[10px] text-slate-500">
                  PDF, XLSX, CSV formats accepted
                </div>
              </label>

              {/* Bank Selector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  Primary Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                >
                  <option value="">Select a bank</option>
                  <option value="State Bank of India — Special Assets">State Bank of India — Special Assets</option>
                  <option value="ICICI Bank — Treasury & Hawala Intercept">ICICI Bank — Treasury &amp; Hawala Intercept</option>
                  <option value="Axis Bank — Commercial Branch">Axis Bank — Commercial Branch</option>
                </select>
              </div>

            </div>

            {/* FIU-IND Alert Banner */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-start gap-2 text-xs text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <strong className="text-slate-700 font-bold">FININT status:</strong> No financial intelligence records available.
              </div>
            </div>

          </div>

          {/* QUADRANT 3: BOTTOM LEFT — Surveillance & Digital Evidence */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Surveillance &amp; Digital Evidence</h2>
                  <p className="text-[10px] text-slate-500 font-medium">
                    CCTV · Mugshots · Digital Forensics · Device Images
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded">
                <Clock className="w-3 h-3 text-amber-600" />
                No data
              </span>
            </div>

            {/* CCTV Frames Gallery */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">CCTV Frames (0 frames)</span>
                <span className="text-[10px] text-slate-500 font-semibold">No frames available</span>
              </div>

              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">No CCTV frames available</div>
            </div>

            {/* Suspect Mugshots */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-800 block">
                Suspect Mugshots (0 uploaded)
              </span>

              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3 flex items-center justify-center rounded-lg border border-dashed border-slate-300 p-4 text-xs text-slate-500">No mugshots available</div>
                <label className="flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-slate-500 hover:text-blue-700 transition-colors cursor-pointer">
                  <input type="file" className="sr-only" accept="image/*" onChange={(event) => handleMugshotUpload(event.target.files?.[0])} />
                  <UserPlus className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Add Mugshot</span>
                  {mugshotFile && <span className="mt-1 max-w-full truncate text-[9px]">{mugshotFile.name}</span>}
                  {mugshotMessage && <span className={`mt-1 text-[9px] text-center ${mugshotState === "error" ? "text-red-600" : "text-emerald-700"}`}>{mugshotMessage}</span>}
                </label>
              </div>
            </div>

            {/* Disk Image Forensics */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-mono text-[11px] font-semibold text-slate-500">
                  No disk image uploaded
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">No data</span>
            </div>

          </div>

          {/* QUADRANT 4: BOTTOM RIGHT — Known Suspect Registry */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-red-700 text-white flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Known Suspect Registry</h2>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Cross-referenced with CCTNS, NATGRID &amp; Interpol Red Notices
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Suspect</span>
                </button>
              </div>

              {/* Suspects Registry Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2 px-2.5">Photo</th>
                      <th className="py-2 px-2.5">Full Name</th>
                      <th className="py-2 px-2.5">Aadhaar / ID</th>
                      <th className="py-2 px-2.5">Phone Number</th>
                      <th className="py-2 px-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr><td colSpan={5} className="py-8 text-center text-slate-500">No suspect records</td></tr>

                  </tbody>
                </table>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
              <span>0 suspects registered for graph link correlation</span>
              <span className="text-emerald-700 font-semibold">NIC Audit Trail Active</span>
            </div>

          </div>

        </div>

        {/* Bottom Bar Action Container */}
        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Summary status checklist */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>CDR — 0 files · 0 records</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>FININT — 0 files · No flagged amount</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Surveillance — 0 files</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Suspects — 0 registered</span>
            </div>
          </div>

          {/* Proceed Button */}
          <Link
            href="/processing"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0c162c] hover:bg-[#152342] text-white text-xs font-bold shadow-lg shadow-slate-900/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Lock Evidence &amp; Initiate Multi-Agency AI Graph Analysis</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

        </div>

      </main>
    </div>
  );
}
