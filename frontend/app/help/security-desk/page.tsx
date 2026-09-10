"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, CircleAlert, Headphones, Send } from "lucide-react";
import OfficerPageShell from "../../../components/OfficerPageShell";

const statuses = ["NETRA Platform", "Authentication Service", "Evidence Repository", "AI Processing", "Audit Service"];
const requests = ["Cannot access NETRA", "Authentication problem", "RBAC / permission issue", "Terminal access problem", "Case access problem", "Evidence repository issue", "AI processing issue", "Other technical issue"];

export default function SecurityDeskPage() {
  const [selectedRequest, setSelectedRequest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Access and authentication");
  const [priority, setPriority] = useState("STANDARD");
  const [docketId, setDocketId] = useState("");

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <OfficerPageShell backHref="/help" backLabel="Back to Help" eyebrow="Secure operations support" title="NIC Security Desk" description="Access, authentication, terminal and platform support.">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-blue-600" /><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">System status</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{statuses.map((status) => <div key={status} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><p className="text-xs font-semibold text-slate-700">{status}</p><p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Operational</p></div>)}</div></section>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Common support requests</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{requests.map((request) => <button key={request} type="button" onClick={() => { setSelectedRequest(request); setDescription(request); }} className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${selectedRequest === request ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{request}</button>)}</div><div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600"><p className="font-bold text-slate-900">NIC Security Desk</p><p className="mt-1">Extension: 1000</p><p>Availability: 24 × 7</p><p className="mt-2 text-xs text-slate-500">Priority support available for critical operational issues.</p></div></section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Support request</h2>{submitted ? <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-2 text-sm font-bold text-emerald-800">Support request submitted to the NIC Security Desk.</p><p className="mt-1 text-xs text-emerald-700">Keep extension 1000 available for follow-up.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-4 text-xs font-semibold text-emerald-800 underline">Submit another request</button></div> : <form onSubmit={submitRequest} className="mt-4 space-y-3"><label className="block text-xs font-semibold text-slate-700">Issue Category<select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"><option>Access and authentication</option><option>RBAC and permissions</option><option>Terminal and platform</option><option>Evidence repository</option><option>AI processing</option><option>Other</option></select></label><label className="block text-xs font-semibold text-slate-700">Priority<select value={priority} onChange={(event) => setPriority(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm"><option>STANDARD</option><option>HIGH</option><option>CRITICAL</option></select></label><label className="block text-xs font-semibold text-slate-700">Description<textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" /></label><label className="block text-xs font-semibold text-slate-700">Case / Docket ID (optional)<input value={docketId} onChange={(event) => setDocketId(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" /></label><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#0c162c] px-4 py-2 text-xs font-bold text-white hover:bg-[#152342]"><Send className="h-4 w-4" />Submit Support Request</button></form>}</section>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800"><CircleAlert className="h-4 w-4 shrink-0" />Do not include sensitive case material in this local support form.</div>
    </OfficerPageShell>
  );
}
