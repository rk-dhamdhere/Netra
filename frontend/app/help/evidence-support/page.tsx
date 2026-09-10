"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileCheck, History, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import OfficerPageShell from "../../../components/OfficerPageShell";

const integrityActions = ["Verify Exhibit Hash", "Check Evidence Integrity", "View Exhibit History", "Verify Chain of Custody", "Check Evidence Seal"];
const guidance = ["Handle sensitive evidence only in the authorized secure terminal.", "Use least-privilege access and never share evidence through unsecured channels.", "Export only through the approved evidence workflow and preserve the original.", "Keep custody changes and verification events audit-logged for Sec 65B preparation."];

export default function EvidenceSupportPage() {
  const [actionMessage, setActionMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [exhibitId, setExhibitId] = useState("CUS-2024-001-A");

  const reportConcern = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <OfficerPageShell backHref="/help" backLabel="Back to Help" eyebrow="Security and evidence" title="Security and Evidence Support" description="Evidence integrity, chain of custody and compliance support.">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-600" /><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Evidence integrity</h2></div><div className="mt-4 space-y-2">{integrityActions.map((action) => <button key={action} type="button" onClick={() => setActionMessage(`${action} completed for ${exhibitId}. Verification event recorded.`)} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"><Search className="h-4 w-4 text-blue-600" />{action}</button>)}</div>{actionMessage && <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">{actionMessage}</p>}</section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><div className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-emerald-600" /><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Chain of custody</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Exhibit ID", "CUS-2024-001-A"], ["Evidence status", "Sealed"], ["Hash status", "SHA-256 verified"], ["Seal status", "Intact"], ["Custody status", "Complete"], ["Last verified", "2026-09-08 00:39 IST"]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-[11px] text-slate-500">{label}</p><p className="mt-1 text-sm font-bold text-slate-900">{value}</p></div>)}</div><div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-600"><p className="font-bold text-slate-900">Verification history</p><p className="mt-2">2026-09-08 · Hash verified by Insp. Rajesh Sharma</p><p className="mt-1">2026-09-08 · Evidence sealed to NIC SecureVault</p></div></section>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Security guidance</h2><ul className="mt-3 space-y-3">{guidance.map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul><div className="mt-5 border-t border-slate-100 pt-4"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Sec 65B / digital evidence</h2><p className="mt-2 text-sm leading-6 text-slate-600">Prepare the certificate from verified source material, custody history, and the immutable audit record.</p><Link href="/review" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#d97706] px-4 py-2 text-xs font-bold text-white hover:bg-[#b45309]"><FileCheck className="h-4 w-4" />Prepare Sec 65B Report</Link></div></section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Report an evidence concern</h2>{submitted ? <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-2 text-sm font-bold text-emerald-800">Evidence concern recorded for review.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-3 text-xs font-semibold text-emerald-800 underline">Report another concern</button></div> : <form onSubmit={reportConcern} className="mt-4 space-y-3"><label className="block text-xs font-semibold text-slate-700">Exhibit ID<input required value={exhibitId} onChange={(event) => setExhibitId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" /></label><label className="block text-xs font-semibold text-slate-700">Issue Type<select className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"><option>Hash mismatch</option><option>Seal concern</option><option>Custody discrepancy</option><option>Access concern</option></select></label><label className="block text-xs font-semibold text-slate-700">Severity<select className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"><option>STANDARD</option><option>HIGH</option><option>CRITICAL</option></select></label><label className="block text-xs font-semibold text-slate-700">Description<textarea required rows={3} className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" /></label><button type="submit" className="rounded-lg bg-[#0c162c] px-4 py-2 text-xs font-bold text-white hover:bg-[#152342]">Report Evidence Concern</button></form>}</section>
      </div>
    </OfficerPageShell>
  );
}
