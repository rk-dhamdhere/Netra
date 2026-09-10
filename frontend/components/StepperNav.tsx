"use client";

import React from "react";
import Link from "next/link";
import { Check, ChevronRight, Info } from "lucide-react";

export interface StepperNavProps {
  currentStep: number; // 1 to 6
  caseSubtitle?: string;
}

const steps = [
  { id: 1, name: "Officer Hub", href: "/dashboard" },
  { id: 2, name: "Case Docket", href: "/docket" },
  { id: 3, name: "Chain of Custody", href: "/custody" },
  { id: 4, name: "AI Processing", href: "/processing" },
  { id: 5, name: "Tactical Dashboard", href: "/review" },
  { id: 6, name: "Field Intel Update", href: "/intel" },
];

export default function StepperNav({
  currentStep = 1,
  caseSubtitle = "Case will be auto-assigned Docket ID upon verification",
}: StepperNavProps) {
  return (
    <nav aria-label="Investigation Workflow Steps" className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs select-none">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Stepper Pills */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto py-0.5">
          {steps.map((step, idx) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                <Link
                  href={step.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    isCurrent
                      ? "bg-[#0b1120] text-white shadow-xs"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/60"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {isCompleted ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                  <span>{step.name}</span>
                </Link>

                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Info Tag */}
        {caseSubtitle && (
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{caseSubtitle}</span>
          </div>
        )}

      </div>
    </nav>
  );
}
