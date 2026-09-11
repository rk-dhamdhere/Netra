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
  const [messages, setMessages] = useState<SitrepMessage[]>([]);

  const [newMessage, setNewMessage] = useState("");
  const [apnrLocked, setApnrLocked] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const msg: SitrepMessage = {
        id: Date.now().toString(),
        sender: "Current operator",
        unit: "Field dispatch",
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
        caseId="" 
        classification="CONFIDENTIAL" 
      />

      {/* Stepper Navigation */}
      <StepperNav 
        currentStep={6} 
        caseSubtitle="No active case selected · Realtime Ground Team SITREP & Field Dispatch"
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
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                <span>No deployed ground units</span>
            </div>
            <div className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                GPS Vector Sync: No data
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
                <span className="bg-slate-500 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  NO DATA
                </span>
                <span className="text-xs text-slate-200 font-bold">
                  No active field intercept
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                No field telemetry available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled
              className="px-3.5 py-1.5 rounded-lg bg-slate-400 text-white text-xs font-bold shadow-xs cursor-not-allowed"
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
                <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  0 ACTIVE
                </span>
              </div>

              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">No deployed ground squads</div>
            </div>

            {/* Statutory Warrant Authority Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Legal Authority Matrix
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  No authority data
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>• Interrogation Warrant: <strong className="text-slate-500">—</strong></div>
                <div>• Telecom Intercept Order: <strong className="text-slate-500">—</strong></div>
                <div>• FSL Evidence Integrity: <strong className="text-slate-500">No data</strong></div>
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
                <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  NO DETECTIONS
                </span>
              </div>

              {/* ANPR Camera Frame */}
              <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 aspect-16/9 flex items-center justify-center p-3 select-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900 to-black/80 pointer-events-none" />
                
                {/* Visual highway surveillance texture */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]" />

                <span className="relative z-10 text-xs text-slate-300">No ANPR detections available</span>
              </div>

              {/* Vehicle Tracking Telemetry */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">CURRENT SPEED</span>
                  <span className="text-slate-500 font-bold">No data</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">HEADING</span>
                  <span className="text-slate-500 font-bold">No data</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">LAST CONTACT</span>
                  <span className="text-slate-500 font-bold">No data</span>
                </div>
              </div>
            </div>

            {/* Rapid Intercept Trigger Button */}
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 bg-slate-400 text-white rounded-lg text-xs font-bold shadow-md cursor-not-allowed flex items-center justify-center gap-2"
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
                <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  NO DATA
                </span>
              </div>

              {/* Message Feed */}
              <div className="space-y-2.5 flex-1 max-h-[320px] overflow-y-auto pr-1 text-xs">
                {messages.length === 0 && <div className="py-8 text-center text-slate-500">No field SITREP messages</div>}
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
              <span className="text-slate-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>No docket sealed</span>
            </span>
            <span>•</span>
            <span>Sec 65B certificate: No data</span>
            <span>•</span>
            <span>No communications logged</span>
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
