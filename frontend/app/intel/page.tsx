"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Radio, 
  Car, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Check, 
  AlertTriangle, 
  Users, 
  Clock, 
  FileText, 
  Printer, 
  Camera, 
  ArrowLeft, 
  Phone, 
  Compass, 
  Lock,
  ArrowRight,
  Shield,
  Activity,
  CheckCircle2
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";

interface SitrepMessage {
  id: string;
  sender: string;
  unit: string;
  time: string;
  text: string;
  type: "info" | "urgent" | "action";
}

export default function FieldIntelUpdatePage() {
  const [messages, setMessages] = useState<SitrepMessage[]>([
    {
      id: "1",
      sender: "Insp. V. Kulkarni",
      unit: "SOG Alpha",
      time: "00:36 IST",
      text: "Target vehicle MH-02-AB-1234 identified at Western Express Highway Toll. Maintaining covert trailing distance.",
      type: "urgent",
    },
    {
      id: "2",
      sender: "SI R. Mehra",
      unit: "Cyber Cell",
      time: "00:38 IST",
      text: "Primary IMEI 86392004XXXXX registered on Cell-ID 40291 (Andheri East). Handshake confirmed.",
      type: "info",
    },
    {
      id: "3",
      sender: "Control Room",
      unit: "NCRB Command",
      time: "00:39 IST",
      text: "Sec 41A CrPC notice and detention authorization transmitted to SOG Team Alpha.",
      type: "action",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [apnrLocked, setApnrLocked] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const msg: SitrepMessage = {
        id: Date.now().toString(),
        sender: "Insp. Rajesh Sharma, IPS",
        unit: "Supervisory IO",
        time: "Just now",
        text: newMessage.trim(),
        type: "action",
      };
      setMessages([...messages, msg]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      {/* Global Header */}
      <GlobalHeader 
        caseId="Case FIR-2026-08417" 
        classification="CONFIDENTIAL" 
      />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={6} 
        caseSubtitle="Case FIR-2026-08417 · Realtime Ground Team SITREP & Field Dispatch Active" 
      />

      {/* Subheader Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-4 h-4 text-emerald-200 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                Field Intel Update &amp; Tactical Dispatch
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Step 6 of 6 · Realtime Ground Intercept, ANPR Automated Alerts &amp; Interrogation Coordination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Ground Intercept Units: 3 Deployed</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              GPS Vector Sync: Active
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5 space-y-4">
        
        {/* Priority Tactical Alert */}
        <div className="bg-gradient-to-r from-slate-900 via-[#0c162c] to-blue-950 text-white p-3.5 sm:p-4 rounded-xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  LIVE INTERCEPT
                </span>
                <span className="text-xs text-slate-200 font-bold">
                  SOG Team Alpha closing in on Target Vikram alias Vicky
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Vehicle MH-02-AB-1234 moving North on Kurla Link Road · Last ANPR trigger: 00:36 IST (98.6% plate confidence)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Emergency Perimeter Lock Broadcasted to all Regional PCR Vans.")}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Seal Road Perimeter
            </button>
          </div>
        </div>

        {/* 3-Column Tactical Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT COLUMN: Ground Intercept Units (4 Cols) */}
          <div className="lg:col-span-4 space-y-3.5 flex flex-col justify-between">
            
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase">
                    Deployed Ground Squads
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  3 ACTIVE
                </span>
              </div>

              {/* Squad 1 */}
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Squad Alpha — SOG Mumbai</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    In Pursuit
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Leader: Insp. V. Kulkarni (4 Operatives)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Location: Western Express Toll Plaza (300m behind target)
                </div>
              </div>

              {/* Squad 2 */}
              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Squad Bravo — Cyber Triangulation</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                    Live RF Lock
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Leader: Sub-Inspector R. Mehra
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Cell Tower: DEL-40291 (Signal: -58 dBm Strong)
                </div>
              </div>

              {/* Squad 3 */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Squad Charlie — Special Cell Delhi</span>
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                    Staged
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Target: Sadar Bazar Hawala Hub (Simultaneous Raid)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Status: Awaiting GO Command
                </div>
              </div>
            </div>

            {/* Statutory Warrant Authority Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Legal Authority Matrix
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Sec 41A CrPC
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>• Interrogation Warrant: <strong className="text-slate-800">W-2024-0098</strong></div>
                <div>• Telecom Intercept Order: <strong className="text-slate-800">LI/DL/2024/00441</strong></div>
                <div>• FSL Evidence Integrity: <strong className="text-emerald-700">100% Hash Verified</strong></div>
              </div>
            </div>

          </div>

          {/* MIDDLE COLUMN: Live ANPR & Geospatial Vector Tracking (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex flex-col justify-between">
            
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase">
                    Automated Number Plate Recognition (ANPR / APPR)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  98.6% MATCH
                </span>
              </div>

              {/* ANPR Camera Frame */}
              <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 aspect-16/9 flex flex-col justify-between p-3 select-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-black/80 pointer-events-none" />
                
                {/* Visual highway surveillance texture */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Car Silhouette in frame */}
                <div className="relative z-10 mx-auto my-auto flex flex-col items-center">
                  <div className="w-48 h-20 bg-slate-800 rounded-lg border-2 border-emerald-400/80 p-2 flex flex-col justify-between shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <div className="flex justify-between text-[9px] font-mono text-emerald-400">
                      <span>ANPR-CAM-09</span>
                      <span>CONF: 98.6%</span>
                    </div>
                    {/* License Plate Box */}
                    <div className="bg-yellow-400 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded border-2 border-slate-900 self-center tracking-wider">
                      MH 02 AB 1234
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                  <span>Toll Plaza Camera 04 · Lane 3</span>
                  <span className="bg-black/60 px-1.5 py-0.5 rounded text-emerald-400">00:36:12 IST</span>
                </div>
              </div>

              {/* Vehicle Tracking Telemetry */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">CURRENT SPEED</span>
                  <span className="text-slate-900 font-bold">42 KM/H</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">HEADING</span>
                  <span className="text-slate-900 font-bold">042° NE (Kurla)</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">LAST CONTACT</span>
                  <span className="text-emerald-700 font-bold">14s ago</span>
                </div>
              </div>
            </div>

            {/* Rapid Intercept Trigger Button */}
            <button
              type="button"
              onClick={() => alert("SOG Alpha instructed to execute lawful vehicle stop at Intersection 14.")}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Authorize Ground Intercept at Next Signal</span>
            </button>

          </div>

          {/* RIGHT COLUMN: Realtime SITREP Communication Dispatch Log (3 Cols) */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
            
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-xs font-bold text-slate-900 uppercase">
                    Field SITREP Dispatch
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ENCRYPTED
                </span>
              </div>

              {/* Message Feed */}
              <div className="space-y-2.5 flex-1 max-h-[320px] overflow-y-auto pr-1 text-xs">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                      msg.type === "urgent"
                        ? "bg-red-50/70 border-red-200 text-red-950"
                        : msg.type === "action"
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-900">{msg.sender} ({msg.unit})</span>
                      <span className="text-slate-500 font-mono">{msg.time}</span>
                    </div>
                    <p className="text-[11px] leading-snug">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Input */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Broadcast order to field..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                className="p-2 bg-[#0c162c] hover:bg-[#152342] text-white rounded-lg cursor-pointer transition-colors"
                title="Send SITREP broadcast"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Docket Sealed</span>
            </span>
            <span>•</span>
            <span>Sec 65B Electronic Certificate Issued</span>
            <span>•</span>
            <span>All Comms Audit-Logged</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/review"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Back to Evidence Review
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0c162c] hover:bg-[#152342] text-white font-bold shadow-md shadow-slate-900/20 transition-all cursor-pointer"
            >
              <span>Return to Officer Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
