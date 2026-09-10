"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  CircleHelp,
  ClipboardList,
  KeyRound,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

export interface ProfileUser {
  name: string;
  role: string;
  badge: string;
  initials: string;
}

interface ProfileDropdownProps {
  user: ProfileUser;
  onProfile: () => void;
  onAccessRBAC: () => void;
  onAuditTrail: () => void;
  onSettings: () => void;
  onHelp: () => void;
  onLogout: () => void;
}

const menuItems = [
  { label: "My Profile", icon: UserRound, callback: "onProfile" },
  { label: "Access & RBAC", icon: KeyRound, callback: "onAccessRBAC" },
  { label: "Audit Trail", icon: ClipboardList, callback: "onAuditTrail" },
  { label: "Settings", icon: Settings, callback: "onSettings" },
  { label: "Help", icon: CircleHelp, callback: "onHelp" },
] as const;

export default function ProfileDropdown({
  user,
  onProfile,
  onAccessRBAC,
  onAuditTrail,
  onSettings,
  onHelp,
  onLogout,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const callbacks = {
    onProfile,
    onAccessRBAC,
    onAuditTrail,
    onSettings,
    onHelp,
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeAfter = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg p-1.5 text-left transition-colors duration-200 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-400/40 bg-gradient-to-tr from-slate-700 to-slate-500 text-xs font-bold text-white shadow-inner">
            {user.initials}
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b1120] bg-emerald-500" />
        </div>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="font-bold text-slate-200">{user.name}</span>
          <span className="mt-0.5 text-[10px] text-slate-400">{user.role}</span>
        </span>
        <ChevronUp
          className={`hidden h-4 w-4 text-slate-400 transition-transform duration-200 sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        role="menu"
        aria-hidden={!isOpen}
        className={`absolute right-0 top-[calc(100%+12px)] z-[60] w-[min(320px,90vw)] origin-top-right rounded-2xl border border-[#e2e8f0] bg-white p-2 text-[#334155] shadow-[0_16px_48px_rgba(15,23,42,0.12)] transition-all duration-200 ease-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="border-b border-[#e2e8f0] px-3 pb-3 pt-2">
          <p className="text-base font-semibold text-[#0f172a]">{user.name}</p>
          <p className="mt-0.5 text-sm text-[#64748b]">{user.role}</p>
          <p className="mt-0.5 text-sm text-[#94a3b8]">{user.badge}</p>
        </div>

        <div className="py-2">
          {menuItems.map(({ label, icon: Icon, callback }) => (
            <button
              key={label}
              type="button"
              role="menuitem"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => closeAfter(callbacks[callback])}
              className="flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-base text-[#64748b] transition-colors duration-200 hover:bg-[#f8fafc] hover:text-[#0f172a] focus:bg-[#f8fafc] focus:outline-none"
            >
              <Icon className="h-5 w-5 text-[#64748b]" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-[#e2e8f0] pt-2">
          <button
            type="button"
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => closeAfter(onLogout)}
            className="flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-base text-[#ef4444] transition-colors duration-200 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
