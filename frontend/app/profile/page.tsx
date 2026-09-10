import { BadgeCheck, Building2, Mail, Phone, UserRound } from "lucide-react";
import OfficerPageShell from "../../components/OfficerPageShell";

const profileRows = [
  ["Officer name", "Insp. Rajesh Sharma"],
  ["Rank / designation", "IPS — Senior Investigating Officer"],
  ["Badge / officer ID", "IN-9842"],
  ["Jurisdiction", "Federal Special Cell / NCR"],
  ["Security clearance", "Level-4 (Restricted SCI)"],
  ["NIC node & vault", "DEL-SRV-09 (AES-256)"],
];

export default function ProfilePage() {
  return (
    <OfficerPageShell eyebrow="Officer account" title="My Profile" description="Review the identity and account information associated with your NETRA officer terminal.">
      <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0c162c] text-xl font-bold text-white">RS</div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Insp. Rajesh Sharma</h2>
              <p className="mt-1 text-sm text-slate-500">IPS — Senior Investigating Officer</p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <BadgeCheck className="h-4 w-4" /> Active officer account
              </span>
            </div>
          </div>
          <div className="mt-5 space-y-4 text-sm">
            <p className="flex items-center gap-3 text-slate-600"><Building2 className="h-4 w-4 text-slate-400" /> Federal Special Cell / NCR</p>
            <p className="flex items-center gap-3 text-slate-600"><Mail className="h-4 w-4 text-slate-400" /> rajesh.sharma@netra.gov.in</p>
            <p className="flex items-center gap-3 text-slate-600"><Phone className="h-4 w-4 text-slate-400" /> NIC secure extension 9842</p>
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserRound className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Profile information</h2>
          </div>
          <dl className="divide-y divide-slate-100">
            {profileRows.map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-slate-500">{label}</dt><dd className="text-right font-semibold text-slate-900">{value}</dd></div>)}
          </dl>
        </section>
      </div>
    </OfficerPageShell>
  );
}
