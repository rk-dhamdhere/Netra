import { BookOpen, CircleHelp, Headphones, ShieldCheck } from "lucide-react";
import Link from "next/link";
import OfficerPageShell from "../../components/OfficerPageShell";

const helpItems = [
  [BookOpen, "NETRA operations guide", "Review the investigation workflow, evidence handling, and intelligence review procedures.", "/help/operations"],
  [Headphones, "NIC Security Desk", "For access or terminal issues, contact the secure operations desk at extension 1000.", "/help/security-desk"],
  [ShieldCheck, "Security and evidence support", "Report evidence integrity concerns through the Audit Trail and preserve the related exhibit ID.", "/help/evidence-support"],
];

export default function HelpPage() {
  return (
    <OfficerPageShell eyebrow="Support and guidance" title="Help" description="Find operational guidance and secure support contacts for the NETRA investigation platform.">
      <div className="grid gap-4 md:grid-cols-3">{helpItems.map(([Icon, title, description, href]) => { const HelpIcon = Icon as typeof CircleHelp; return <Link key={title as string} href={href as string} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs cursor-pointer"><HelpIcon className="h-5 w-5 text-blue-600" /><h2 className="mt-4 text-sm font-bold text-slate-900">{title as string}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description as string}</p></Link>; })}</div>
      <section className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5"><div className="flex items-start gap-3"><CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><div><h2 className="text-sm font-bold text-blue-950">Need assistance with an active case?</h2><p className="mt-1 text-sm text-blue-800">Keep the docket ID and exhibit reference ready when contacting the NIC Security Desk. Do not include sensitive case material in unsecured messages.</p></div></div></section>
    </OfficerPageShell>
  );
}
