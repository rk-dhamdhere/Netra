"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  CircleHelp,
  ClipboardList,
  KeyRound,
  Settings,
} from "lucide-react";

interface ProfileDropdownProps {
  onAccessRBAC: () => void;
  onAuditTrail: () => void;
  onSettings: () => void;
  onHelp: () => void;
}

const menuItems = [
  { label: "Access & RBAC", icon: KeyRound, callback: "onAccessRBAC" },
  { label: "Audit Trail", icon: ClipboardList, callback: "onAuditTrail" },
  { label: "Settings", icon: Settings, callback: "onSettings" },
  { label: "Help", icon: CircleHelp, callback: "onHelp" },
] as const;

export default function ProfileDropdown({
  onAccessRBAC,
  onAuditTrail,
  onSettings,
  onHelp,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const callbacks = {
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
      </div>
    </div>
  );
}
