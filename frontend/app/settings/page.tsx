"use client";

import { useState } from "react";
import { Bell, Check, Monitor, ShieldCheck } from "lucide-react";
import OfficerPageShell from "../../components/OfficerPageShell";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [secureMode, setSecureMode] = useState(true);

  return (
    <OfficerPageShell eyebrow="Terminal preferences" title="Settings" description="Manage local notification and security preferences for the active NETRA terminal.">
      <section className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Account and terminal settings</h2>
        <div className="mt-4 divide-y divide-slate-100">
          <label className="flex cursor-pointer items-center justify-between gap-4 py-4"><span className="flex items-center gap-3"><Bell className="h-5 w-5 text-slate-500" /><span><span className="block text-sm font-semibold text-slate-900">Operational notifications</span><span className="mt-1 block text-xs text-slate-500">Receive alerts for assigned cases and evidence processing.</span></span></span><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} className="h-4 w-4 accent-blue-600" /></label>
          <label className="flex cursor-pointer items-center justify-between gap-4 py-4"><span className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-slate-500" /><span><span className="block text-sm font-semibold text-slate-900">Restricted security mode</span><span className="mt-1 block text-xs text-slate-500">Keep sensitive evidence workflows in the Level-4 secure context.</span></span></span><input type="checkbox" checked={secureMode} onChange={(event) => setSecureMode(event.target.checked)} className="h-4 w-4 accent-blue-600" /></label>
          <div className="flex items-center gap-3 py-4"><Monitor className="h-5 w-5 text-slate-500" /><div><p className="text-sm font-semibold text-slate-900">Terminal</p><p className="mt-1 text-xs text-slate-500">DEL-SRV-09 · AES-256 encrypted · Session active</p></div><span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><Check className="h-4 w-4" /> Secure</span></div>
        </div>
      </section>
    </OfficerPageShell>
  );
}
