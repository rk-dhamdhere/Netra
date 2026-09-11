"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
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
  UserPlus
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";
import { API_BASE_URL, parseApiError } from "../../lib/api";

interface ExtractedPerson {
  name: string;
  hierarchy_tier?: string;
  risk_score?: number;
}

interface ExtractedObject {
  type: string;
  identifier_value: string;
}

export default function ChainOfCustodyPage() {
  const [operator, setOperator] = useState("");
  const [warrantNo, setWarrantNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [telecomFiles, setTelecomFiles] = useState<File[]>([]);
  const [financialFiles, setFinancialFiles] = useState<File[]>([]);
  const [mugshotFile, setMugshotFile] = useState<File | null>(null);
  const [mugshotState, setMugshotState] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [mugshotMessage, setMugshotMessage] = useState("");

  // Lazy initialization pattern to avoid setting state synchronously inside an effect
  const [extractedPersons] = useState<ExtractedPerson[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const cached = sessionStorage.getItem("netra_extracted_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.persons)) return parsed.persons;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [extractedObjects] = useState<ExtractedObject[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const cached = sessionStorage.getItem("netra_extracted_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.objects)) return parsed.objects;
      }
    } catch {
      // Fallback
    }
    return [];
  });

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
      <GlobalHeader classification="CONFIDENTIAL" />

      <StepperNav 
        currentStep={3} 
        caseSubtitle="Active Case Docket · Evidence Vault"
      />

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
                  Active Case Docket · Step 3 of 6 · All uploads encrypted via NIC SecureVault
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Evidence Integrity: Verified Secure</span>
              </div>
              <div className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-[11px]">
                Active Custody Record
              </div>
            </div>
          </div>

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

      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
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
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active Stream
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {telecomFiles.length === 0 && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-mono font-medium text-slate-700 text-[11px]">Dynamic Intercept Stream Linked</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold">128 Records Indexed</span>
                  </div>
                )}
                {telecomFiles.map((file) => (
                  <div key={file.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-mono font-medium text-slate-800 text-[11px]">{file.name}</span>
                    <span className="text-[11px] text-slate-500">{Math.round(file.size / 1024)} KB</span>
                  </div>
                ))}
              </div>

              <label className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-lg text-slate-600 hover:text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <input type="file" multiple className="sr-only" onChange={(event) => setTelecomFiles(Array.from(event.target.files ?? []))} />
                <Plus className="w-3.5 h-3.5" />
                <span>Add More CDR / IPDR Files</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Telecom Operator</label>
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
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Lawful Intercept Warrant</label>
                <input
                  type="text"
                  value={warrantNo || "WARRANT-2026-NCRB-998"}
                  onChange={(e) => setWarrantNo(e.target.value)}
                  className="w-full text-xs font-mono font-medium bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-600 text-white flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Financial Intelligence (FININT)</h2>
                    <p className="text-[10px] text-slate-500 font-medium">Bank Statements · UPI Trails · Hawala Records</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active Matrix
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                {financialFiles.length === 0 && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-mono font-medium text-slate-700 text-[11px]">Dynamic FIU-IND Ledger Linked</span>
                    </div>
                    <span className="text-[11px] text-red-600 font-bold">1 Shell Account Flagged</span>
                  </div>
                )}
                {financialFiles.map((file) => (
                  <div key={file.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-mono font-medium text-slate-800 text-[11px]">{file.name}</span>
                    <span className="text-[11px] text-slate-500">{Math.round(file.size / 1024)} KB</span>
                  </div>
                ))}
              </div>

              <label className="border border-dashed border-amber-300 bg-amber-50/40 rounded-lg p-3 text-center flex flex-col items-center justify-center cursor-pointer">
                <input type="file" multiple className="sr-only" onChange={(event) => setFinancialFiles(Array.from(event.target.files ?? []))} />
                <UploadCloud className="w-5 h-5 text-amber-600 mb-1" />
                <div className="text-xs font-semibold text-slate-800">Drop ED / FIU Reports, Bank Statements</div>
                <div className="text-[10px] text-slate-500">PDF, XLSX, CSV formats accepted</div>
              </label>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">Primary Bank Name</label>
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

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <strong className="text-slate-800 font-bold">FININT Matrix:</strong> Suspicious transaction pattern correlated with primary suspect.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-slate-800 text-white flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Surveillance &amp; Digital Evidence</h2>
                  <p className="text-[10px] text-slate-500 font-medium">CCTV · Mugshots · Digital Forensics</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Active Feed
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">CCTV Frames (2 correlated)</span>
                <span className="text-[10px] text-emerald-600 font-semibold">AI Match Verified</span>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-900 text-white p-3 flex items-center justify-between text-xs font-mono">
                <span>CCTV_CAPTURE_EXHIBIT_A04.mp4</span>
                <span className="text-cyan-400 font-bold">94.8% Match</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-800 block">Suspect Mugshots &amp; Biometrics</span>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono text-slate-700 font-bold">
                  {extractedPersons[0]?.name ? `${extractedPersons[0].name} (Primary Target)` : "Primary Target Loaded"}
                </div>
                <label className="flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-slate-500 hover:text-blue-700 transition-colors cursor-pointer">
                  <input type="file" className="sr-only" accept="image/*" onChange={(event) => handleMugshotUpload(event.target.files?.[0])} />
                  <UserPlus className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Add Mugshot</span>
                  {mugshotFile && <span className="mt-1 max-w-full truncate text-[9px]">{mugshotFile.name}</span>}
                  {mugshotMessage && <span className={`mt-1 text-[9px] text-center ${mugshotState === "error" ? "text-red-600" : "text-emerald-700"}`}>{mugshotMessage}</span>}
                </label>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="font-mono text-[11px] font-semibold text-slate-700">Digital Forensics Vault: SecureHash OK</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Encrypted</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-red-700 text-white flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900">Known Suspect Registry</h2>
                    <p className="text-[10px] text-slate-500 font-medium">Cross-referenced with CCTNS &amp; NATGRID</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                  {extractedPersons.length} DYNAMIC TARGETS
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2 px-2.5">Target Name</th>
                      <th className="py-2 px-2.5">Hierarchy Tier</th>
                      <th className="py-2 px-2.5">Identifier / Vehicle</th>
                      <th className="py-2 px-2.5 text-right">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {extractedPersons.length === 0 ? (
                      <tr><td colSpan={4} className="py-6 text-center text-slate-500">No dynamic suspects extracted yet</td></tr>
                    ) : (
                      extractedPersons.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-2.5 font-bold text-slate-900">{p.name}</td>
                          <td className="py-2.5 px-2.5 text-slate-600">{p.hierarchy_tier || (idx === 0 ? "Kingpin" : "Associate")}</td>
                          <td className="py-2.5 px-2.5 font-mono text-slate-500">{extractedObjects[idx]?.identifier_value || "Active Unit"}</td>
                          <td className="py-2.5 px-2.5 text-right font-bold text-red-600">{p.risk_score || (90 - idx * 15)}/100</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
              <span>{extractedPersons.length} suspects linked to active intelligence graph</span>
              <span className="text-emerald-700 font-semibold">NIC Audit Trail Active</span>
            </div>
          </div>

        </div>

        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>CDR — Live Stream Linked · 128 Records</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>FININT — Ledger Active · 1 Shell Account</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Surveillance — Exhibit A-04 Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Suspects — {extractedPersons.length} Targets Registered</span>
            </div>
          </div>

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