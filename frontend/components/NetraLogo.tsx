import React from "react";

interface NetraLogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export function NetraTargetIcon({ className = "w-6 h-6 text-white" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="8.5" />
      {/* Center circle */}
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      {/* Crosshairs */}
      <line x1="12" y1="1" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="23" />
      <line x1="1" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="23" y2="12" />
    </svg>
  );
}

export default function NetraLogo({
  variant = "light",
  size = "md",
  showSubtitle = true,
  className = "",
}: NetraLogoProps) {
  const isDark = variant === "dark";

  const sizeConfigs = {
    sm: {
      box: "w-8 h-8 rounded-md p-1.5",
      icon: "w-4 h-4",
      title: "text-base tracking-tight",
      subtitle: "text-[10px] leading-tight",
      gap: "gap-2.5",
    },
    md: {
      box: "w-10 h-10 rounded-lg p-2 shadow-sm",
      icon: "w-5 h-5",
      title: "text-xl tracking-tight",
      subtitle: "text-xs font-normal tracking-tight",
      gap: "gap-3",
    },
    lg: {
      box: "w-12 h-12 rounded-xl p-2.5 shadow-md",
      icon: "w-6 h-6",
      title: "text-2xl tracking-normal",
      subtitle: "text-xs sm:text-sm font-normal",
      gap: "gap-3.5",
    },
  };

  const currentSize = sizeConfigs[size];

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Navy Icon Container */}
      <div
        className={`flex items-center justify-center shrink-0 bg-[#0c162c] text-white border border-slate-700/40 ${currentSize.box}`}
      >
        <NetraTargetIcon className={`${currentSize.icon} text-white`} />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className={`font-black flex items-center gap-1.5 ${currentSize.title}`}>
          <span className={isDark ? "text-white" : "text-[#0c162c]"}>NETRA</span>
          <span className="text-[#2563eb] font-bold">AI</span>
        </div>
        {showSubtitle && (
          <p
            className={`font-medium ${
              isDark ? "text-slate-400" : "text-[#64748b]"
            } ${currentSize.subtitle}`}
          >
            National Investigation Intelligence Platform
          </p>
        )}
      </div>
    </div>
  );
}
