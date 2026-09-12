"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  UploadCloud, 
  Sparkles, 
  Radar, 
  RefreshCw,
  AlertCircle,
  File,
  X
} from "lucide-react";
import GlobalHeader from "../../components/GlobalHeader";
import StepperNav from "../../components/StepperNav";
import { api } from "../../lib/api";

export default function ContinuousIntelPage() {
  const router = useRouter();
  const [newIntelText, setNewIntelText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMergeIntelligence = async () => {
    if (!newIntelText.trim() && !selectedFile) return;
    setIsMerging(true);
    setError("");

    try {
      const existingDataRaw = sessionStorage.getItem("netra_extracted_data") || "{}";
      
      let mergedResponse;

      if (selectedFile) {
        mergedResponse = await api.uploadMergedIntelligenceFile(existingDataRaw, newIntelText, selectedFile);
      } else {
        mergedResponse = await api.extractMergedNarrative(existingDataRaw, newIntelText);
      }

      // Save merged payload
      sessionStorage.setItem("netra_extracted_data", JSON.stringify(mergedResponse));
      
      // Store flag for highlighting new changes in the report page
      sessionStorage.setItem("netra_new_intel_added", "true");

      router.push("/report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge intelligence");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col antialiased text-slate-800">
      <GlobalHeader classification="CONFIDENTIAL" />
      <StepperNav currentStep={6} caseSubtitle="Continuous Investigation Loop · AI Intelligence Fusion" />

      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 shadow-xs">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#0c162c] text-white flex items-center justify-center shadow-xs">
              <Radar className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                New Field Intelligence Injection
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Merge new informant tips, CCTV transcripts, or field data into the existing case graph.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1920px] w-full mx-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          
          {/* LEFT PANEL: Document Upload */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Supplemental Document Upload
              </h2>
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[200px] ${
                selectedFile 
                  ? "border-emerald-500 bg-emerald-50/50" 
                  : "border-slate-300 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/30"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt" 
              />
              
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-sm relative">
                    <File className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800 break-all max-w-[80%]">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <button 
                    onClick={clearFile}
                    className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove File
                  </button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-sm">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Drag &amp; Drop New Evidence
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Supports CDR logs, CCTV Transcripts, PDF Reports
                  </div>
                  <span className="mt-4 px-4 py-1.5 bg-[#0c162c] hover:bg-[#152342] text-white text-xs font-semibold rounded-md shadow-xs transition-colors">
                    Browse Files
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Text Area and Action */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                New Field Intelligence Narrative
              </h2>
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <textarea
                value={newIntelText}
                onChange={(e) => setNewIntelText(e.target.value)}
                placeholder="Enter new informant tips, field observations, or intercepted communications..."
                className="w-full flex-1 min-h-[200px] text-sm font-mono p-4 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 leading-relaxed resize-none"
              />
              {error && (
                <div className="flex items-center gap-1.5 text-red-600 text-xs font-semibold bg-red-50 p-2 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleMergeIntelligence}
              disabled={isMerging || (!newIntelText.trim() && !selectedFile)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-lg text-sm font-bold shadow-md transition-colors cursor-pointer"
            >
              {isMerging ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Fusing Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Analyze &amp; Merge into Case Graph</span>
                </>
              )}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
