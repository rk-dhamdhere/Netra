"use client";

import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import GlobalHeader from "./GlobalHeader";

interface OfficerPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export default function OfficerPageShell({ eyebrow, title, description, children, backHref = "/dashboard", backLabel = "Back to Officer Hub" }: OfficerPageShellProps) {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 antialiased">
      <GlobalHeader />
      <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <div className="mb-6 flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0c162c] text-white">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">{eyebrow}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
