"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  UploadCloud, 
  Plus, 
  X, 
  Check, 
  Clock, 
  Tag, 
  User, 
  MapPin, 
  Car, 
  Building, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  FileCheck2,
  Calendar
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";

export default function CaseDocketPage() {
  const [jurisdiction, setJurisdiction] = useState("Delhi NCR — Special Cell / Federal");
  const [firNumber, setFirNumber] = useState("FIR / 001 / 2024 / DL");
  const [ioId, setIoId] = useState("IN-9842");
  const [priority, setPriority] = useState("CRITICAL");
  const [firDate, setFirDate] = useState("2024-01-12");
  const [offenseDate, setOffenseDate] = useState("2024-01-08");

  const [sections, setSections] = useState<string[]>([
    "420 IPC",
    "467 IPC",
    "120B IPC",
    "468 IPC",
    "BNS 316",
    "IT Act 66C",
    "PMLA 3",
  ]);
  const [newSection, setNewSection] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);

  const [runOcr, setRunOcr] = useState(true);

  const removeSection = (secToRemove: string) => {
    setSections(sections.filter((s) => s !== secToRemove));
  };

  const handleAddSection = () => {
    if (newSection.trim() && !sections.includes(newSection.trim())) {
      setSections([...sections, newSection.trim()]);
      setNewSection("");
      setShowAddSection(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      {/* Global Top Bar */}
      <GlobalHeader classification="CONFIDENTIAL" />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={2} 
        caseSubtitle="Case will be auto-assigned Docket ID upon verification" 
      />

      {/* Subheader / Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-900 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                Case Docket &amp; Text Ingestion
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                New FIR Intake — Step 2 of 6 · CCTNS Integration Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CCTNS Live Connection: Encrypted via NIC Gateway</span>
          </div>
        </div>
      </div>

      {/* Main Form Workspace */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          
          {/* LEFT PANEL: Case Metadata & Document Upload (5 Cols) */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Case Metadata &amp; Document Upload
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
                <Clock className="w-3 h-3 text-amber-600" />
                Draft — Unsaved
              </span>
            </div>

            {/* Jurisdiction Dropdown */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Jurisdiction
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Delhi NCR — Special Cell / Federal">Delhi NCR — Special Cell / Federal</option>
                <option value="Mumbai Zone — Crime Branch">Mumbai Zone — Crime Branch</option>
                <option value="Bengaluru Central — CCB">Bengaluru Central — CCB</option>
                <option value="Ahmedabad STF — Cyber Cell">Ahmedabad STF — Cyber Cell</option>
                <option value="Kolkata Special Task Force">Kolkata Special Task Force</option>
              </select>
            </div>

            {/* FIR Number */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                FIR Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                placeholder="FIR / ___ / 2024 / DL"
                className="w-full text-xs font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <span className="block text-[10px] text-slate-500">
                Auto-linked to CCTNS portal upon submission
              </span>
            </div>

            {/* IPC / BNS Sections Applied */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                IPC / BNS Sections Applied
              </label>
              <div className="flex flex-wrap gap-1.5 items-center p-2 rounded-lg bg-slate-50 border border-slate-200 min-h-[44px]">
                {sections.map((sec) => (
                  <span
                    key={sec}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white text-slate-800 text-[11px] font-semibold border border-slate-300 shadow-2xs"
                  >
                    <span>{sec}</span>
                    <button
                      type="button"
                      onClick={() => removeSection(sec)}
                      className="text-slate-400 hover:text-red-600 focus:outline-none cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {showAddSection ? (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="text"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      placeholder="e.g. 302 IPC"
                      className="text-xs px-2 py-0.5 rounded border border-blue-400 bg-white w-24 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                    />
                    <button
                      type="button"
                      onClick={handleAddSection}
                      className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddSection(true)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold border border-blue-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Section</span>
                  </button>
                )}
              </div>
            </div>

            {/* Assigned IO & Priority Level */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Assigned IO ID
                </label>
                <input
                  type="text"
                  value={ioId}
                  onChange={(e) => setIoId(e.target.value)}
                  className="w-full text-xs font-mono font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-xs font-bold bg-red-50/70 border border-red-200 text-red-700 rounded-lg px-3 py-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                >
                  <option value="CRITICAL" className="text-red-600 font-bold">CRITICAL</option>
                  <option value="HIGH" className="text-amber-600 font-bold">HIGH</option>
                  <option value="MEDIUM" className="text-slate-600 font-semibold">MEDIUM</option>
                </select>
              </div>
            </div>

            {/* FIR Date & Offense Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  FIR Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={firDate}
                    onChange={(e) => setFirDate(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase">
                  Offense Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={offenseDate}
                    onChange={(e) => setOffenseDate(e.target.value)}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700 uppercase">
                Document Upload
              </label>

              {/* Drag and drop box */}
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Drag &amp; Drop or Click to Upload
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Scanned FIR (PDF), Witness Statements (PDF/DOCX/JPG)
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">
                  Max 50MB per file · Encrypted upload via NIC gateway
                </div>
                <button
                  type="button"
                  className="mt-2.5 px-3 py-1 bg-[#0c162c] hover:bg-[#152342] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                >
                  Browse Files
                </button>
              </div>

              {/* Uploaded Files list */}
              <div className="space-y-1.5 pt-1">
                {/* File 1 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-800">FIR_DL_001_2024_signed.pdf</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">2.4 MB</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Uploaded
                  </span>
                </div>

                {/* File 2 */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-semibold text-slate-800">Witness_Statement_Arora.pdf</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">1.1 MB</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 animate-pulse">
                    Uploading...
                  </span>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                {/* OCR Toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Run OCR on Scanned Documents
                  </span>
                  <button
                    type="button"
                    onClick={() => setRunOcr(!runOcr)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      runOcr ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        runOcr ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT PANEL: Field Notes & Informant Narrative (7 Cols) */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col space-y-3.5">
            
            {/* Header with Quick Tag Shortcuts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Field Notes &amp; Informant Narrative
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                <span className="hidden sm:inline">Alt+P Person</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">Alt+L Location</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">Alt+V Vehicle</span>
                <span className="hidden sm:inline">·</span>
                <span className="text-slate-500 font-semibold">↻ Auto-saving...</span>
              </div>
            </div>

            {/* Rich Editor Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              {/* Basic Formatting */}
              <div className="flex items-center gap-0.5 border-r border-slate-300 pr-2">
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700 font-bold">
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700">
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700">
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700">
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-slate-300 mx-1" />
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700">
                  <List className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700">
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button type="button" className="p-1 rounded hover:bg-slate-200 text-slate-700">
                  <Quote className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tagging Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-300 hover:bg-blue-100 transition-colors"
                >
                  <User className="w-3 h-3 text-blue-600" />
                  <span>Tag Person</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-300 hover:bg-amber-100 transition-colors"
                >
                  <MapPin className="w-3 h-3 text-amber-600" />
                  <span>Tag Location</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 text-[11px] font-bold border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <Car className="w-3 h-3 text-emerald-600" />
                  <span>Tag Vehicle</span>
                </button>
              </div>
            </div>

            {/* Narrative Text Container with Highlighting */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs leading-relaxed text-slate-800 space-y-3 font-normal max-h-[380px] overflow-y-auto">
              
              {/* Header metadata tag */}
              <div className="font-mono text-[10px] text-slate-500 pb-1 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-3 h-3" />
                <span>CASE NARRATIVE — FIR/001/2024/DL — CONFIDENTIAL — IO: IN-9842 — 12 JAN 2024 14:32 IST</span>
              </div>

              <p>
                On the basis of specific intelligence received by the Special Cell, CGO Complex, New Delhi, regarding a highly organized cyber fraud and hawala ring operating under the alias &quot;Operation Black Lotus,&quot; a team led by the undersigned Investigating Officer commenced a covert surveillance operation on 08 January 2024.
              </p>

              <p>
                Primary suspect{" "}
                <span className="bg-blue-100 text-blue-900 font-semibold px-1.5 py-0.5 rounded border border-blue-300 inline-block shadow-2xs">
                  KARIM ANSARI (alias &quot;The Broker&quot;)
                </span>{" "}
                was identified through IMEI triangulation and CDR analysis. Subject was observed making repeated calls to{" "}
                <span className="bg-blue-100 text-blue-900 font-semibold px-1.5 py-0.5 rounded border border-blue-300 inline-block shadow-2xs">
                  PRIYA MALHOTRA
                </span>{" "}
                and{" "}
                <span className="bg-blue-100 text-blue-900 font-semibold px-1.5 py-0.5 rounded border border-blue-300 inline-block shadow-2xs">
                  UNIT COMMANDER &quot;FALCON&quot;
                </span>{" "}
                (identity pending verification).
              </p>

              <p>
                Financial transactions traced to{" "}
                <span className="bg-amber-100 text-amber-950 font-semibold px-1.5 py-0.5 rounded border border-amber-300 inline-block shadow-2xs">
                  Hawala Nexus — Sadar Bazar, Delhi
                </span>{" "}
                and{" "}
                <span className="bg-amber-100 text-amber-950 font-semibold px-1.5 py-0.5 rounded border border-amber-300 inline-block shadow-2xs">
                  Drop Location — Lajpat Nagar Market
                </span>{" "}
                totaling ₹4.7 Crore in unaccounted transfers across 9 shell accounts at 3 nationalized banks.
              </p>

              <p>
                Vehicle{" "}
                <span className="bg-emerald-100 text-emerald-950 font-semibold px-1.5 py-0.5 rounded border border-emerald-300 inline-block shadow-2xs">
                  DL-3C-AB-9214 (White Toyota Innova)
                </span>{" "}
                was spotted at all three identified drop locations between 06:00–09:00 hrs on multiple dates. CCTV frames obtained from{" "}
                <span className="bg-amber-100 text-amber-950 font-semibold px-1.5 py-0.5 rounded border border-amber-300 inline-block shadow-2xs">
                  Nehru Place Metro Station
                </span>{" "}
                confirm presence.
              </p>

              <p>
                Informant Code DELTA-7 reports that the network&apos;s financial controller operates from{" "}
                <span className="bg-amber-100 text-amber-950 font-semibold px-1.5 py-0.5 rounded border border-amber-300 inline-block shadow-2xs">
                  Office Tower B, Cyber Hub Gurugram
                </span>{" "}
                and uses VoIP routing through a Pakistan-based server to evade interception. Multi-agency coordination with ED, CBI, and IB recommended immediately.
              </p>

            </div>

            {/* Auto-Extracted Entities Cloud Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Auto-Extracted Entities</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0c162c] text-white">
                  14 entities found
                </span>
              </div>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-blue-600" />
                  Karim Ansari — Person
                </span>

                <span className="px-2 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold flex items-center gap-1">
                  <User className="w-3 h-3 text-blue-600" />
                  Priya Malhotra — Person
                </span>

                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                  <Car className="w-3 h-3 text-emerald-600" />
                  DL-3C-AB-9214 — Vehicle
                </span>

                <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  Sadar Bazar, Delhi — Location
                </span>

                <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  Lajpat Nagar — Location
                </span>

                <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  Cyber Hub Gurugram — Location
                </span>

                <span className="px-2 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold flex items-center gap-1">
                  <Building className="w-3 h-3 text-purple-600" />
                  Shell Account ×9 — FinEnt
                </span>

                <span className="px-2 py-1 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-cyan-600" />
                  +91-98XXX-XXXXX — Phone
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status checklist */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>FIR uploaded &amp; OCR complete</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>14 entities tagged for graph analysis</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <Link
              href="/custody"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold shadow-md shadow-amber-900/10 transition-all cursor-pointer"
            >
              <span>Verify Docket &amp; Proceed to Evidence Upload</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}
