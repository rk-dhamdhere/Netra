import { ArrowRight, BookOpen, CheckCircle2, FileCheck, Network, ShieldCheck } from "lucide-react";
import OfficerPageShell from "../../../components/OfficerPageShell";

const workflow = [
  ["Officer Hub", "Review assigned dockets, terminal status, and current investigation workload."],
  ["Case Docket", "Register the FIR, case metadata, source documents, and initial entities."],
  ["Chain of Custody", "Stage evidence, verify exhibits, and maintain a complete custody record."],
  ["AI Processing", "Run OCR, entity extraction, linkage analysis, and enrichment on approved inputs."],
  ["Tactical Dashboard", "Review risk, relationships, hotspots, dossiers, and cross-case signals."],
  ["Field Intel Update", "Publish verified intelligence and operational updates to authorized teams."],
];

const guidance = [
  ["Evidence Handling", ["Review evidence against its exhibit identification and source record.", "Verify the exhibit hash, seal, and chain-of-custody status before use.", "Export evidence or media only through the authorized evidence workflow."], FileCheck],
  ["AI Processing", ["OCR and document parsing make source material searchable.", "Named entity, facial, CDR, cell tower, and financial pattern analysis surface relationships.", "Knowledge graph generation and the AI case summary require officer review before action."], Network],
  ["Intelligence Review", ["Use Suspects — by Risk to prioritize attention.", "Use the Network Knowledge Graph and Geospatial Hotspot Map to examine relationships and locations.", "Cross Case Intelligence, the AI Intelligence Dossier, and the automated summary provide corroborating context."], BookOpen],
  ["Security & Compliance", ["Handle sensitive evidence only in the secure terminal context.", "Rely on audit logging, access controls, and chain-of-custody records for every material action.", "Prepare Sec 65B evidence with preserved source material, verification history, and the authorized certificate workflow."], ShieldCheck],
];

export default function OperationsGuidePage() {
  return (
    <OfficerPageShell backHref="/help" backLabel="Back to Help" eyebrow="Support and guidance" title="NETRA Operations Guide" description="Review the investigation workflow, evidence handling, and intelligence review procedures.">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">Investigation workflow</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">{workflow.map(([name, detail], index) => <div key={name as string} className="relative rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0c162c] text-[10px] font-bold text-white">{index + 1}</span><span className="text-xs font-bold text-slate-900">{name as string}</span></div><p className="mt-3 text-xs leading-5 text-slate-500">{detail as string}</p>{index < workflow.length - 1 && <ArrowRight className="absolute -right-3 top-5 z-10 hidden h-4 w-4 text-slate-400 xl:block" />}</div>)}</div>
      </section>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{guidance.map(([heading, items, Icon]) => { const SectionIcon = Icon as typeof ShieldCheck; return <section key={heading as string} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs"><div className="flex items-center gap-2 border-b border-slate-100 pb-3"><SectionIcon className="h-5 w-5 text-blue-600" /><h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">{heading as string}</h2></div><ul className="mt-3 space-y-3">{(items as string[]).map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></section>; })}</div>
    </OfficerPageShell>
  );
}
