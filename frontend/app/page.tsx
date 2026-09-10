"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { NetraTargetIcon } from "../components/NetraLogo";

export default function LoginPage() {
  const router = useRouter();
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Smooth transition to tactical dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-10 text-[#334155] antialiased selection:bg-blue-100 selection:text-blue-900 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[min(800px,100vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(219,234,254,0.65)_0%,rgba(248,250,252,0)_68%)]" />

      <main className="relative z-10 flex w-full max-w-[520px] flex-col items-center">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f172a] shadow-lg shadow-slate-900/10">
            <NetraTargetIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">NETRA</h1>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#64748b]">
            National Investigation Intelligence Platform
          </p>
        </div>

        <div className="w-full rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight text-[#0f172a]">Investigator Login</h2>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Sign in with your issued credentials to access the case network.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-[#334155]">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="username"
                  type="text"
                  required
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="Enter username"
                  className="h-[54px] w-full rounded-xl border border-[#e2e8f0] bg-white pl-11 pr-4 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-[#94a3b8]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#334155]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94a3b8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-[54px] w-full rounded-xl border border-[#e2e8f0] bg-white pl-11 pr-12 text-sm text-[#0f172a] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-[#94a3b8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0 top-0 flex h-[54px] items-center px-4 text-[#94a3b8] transition hover:text-[#334155] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-[#64748b]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] accent-[#0f172a] focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-medium text-[#2563eb] transition hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#1e293b] focus:outline-none focus:ring-4 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Secure Login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-xs font-medium text-[#64748b]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#64748b]" />
              Government Security Certified
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#64748b]" />
              AES-256 Encrypted
            </span>
          </div>
        </div>

        <footer className="mt-6 text-center text-[11px] text-[#94a3b8]">
          Authorized Personnel Only · Unauthorized access is a punishable offense under law
        </footer>
      </main>
    </div>
  );
}
