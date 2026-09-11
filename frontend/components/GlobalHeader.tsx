"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NetraTargetIcon } from "./NetraLogo";
import ProfileDropdown from "./common/ProfileDropdown";

interface GlobalHeaderProps {
  caseId?: string;
  classification?: string;
}

export default function GlobalHeader(_props: GlobalHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-[#0b1120] text-white border-b border-slate-800 text-xs select-none sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/dashboard"
          aria-label="NETRA dashboard"
          className="flex items-center gap-3 rounded-lg px-1 py-1 transition-opacity duration-200 hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/50 bg-[#16223e] text-blue-400 shadow-inner">
            <NetraTargetIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[28px] font-black tracking-tight text-white leading-none">NETRA</span>
            <span className="text-[9px] font-medium text-blue-300 leading-none">
              National Investigation Intelligence Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ProfileDropdown
            onAccessRBAC={() => router.push("/access")}
            onAuditTrail={() => router.push("/audit")}
            onSettings={() => router.push("/settings")}
            onHelp={() => router.push("/help")}
          />
        </div>
      </div>
    </header>
  );
}
