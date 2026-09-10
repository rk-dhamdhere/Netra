import { CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import OfficerPageShell from "../../components/OfficerPageShell";

const permissions = ["View and manage assigned case dockets", "Access chain-of-custody evidence vault", "Run AI-assisted evidence processing", "Review tactical intelligence and network graphs", "Export cryptographic audit ledgers"];
const modules = ["Officer Hub", "Case Docket", "Chain of Custody", "AI Processing", "Tactical Dashboard", "Field Intel Update"];

export default function AccessPage() {
  return (
    <OfficerPageShell eyebrow="Identity and permissions" title="Access & RBAC" description="View the role, authorization level, and NETRA modules available to this officer account.">
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-1">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <h2 className="mt-4 text-lg font-bold text-slate-950">Senior Investigating Officer</h2>
          <p className="mt-1 text-sm text-slate-500">Role: INVESTIGATOR_L4</p>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Access status: Active</div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600"><LockKeyhole className="h-4 w-4 text-slate-400" /> Level-4 Restricted SCI</div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">System permissions</h2>
          <ul className="mt-3 divide-y divide-slate-100">{permissions.map((permission) => <li key={permission} className="flex items-center gap-3 py-3 text-sm text-slate-700"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{permission}</li>)}</ul>
          <h2 className="mt-5 border-t border-slate-100 pt-5 text-sm font-bold uppercase tracking-wide text-slate-900">Accessible modules</h2>
          <div className="mt-3 flex flex-wrap gap-2">{modules.map((module) => <span key={module} className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-800">{module}</span>)}</div>
        </section>
      </div>
    </OfficerPageShell>
  );
}
