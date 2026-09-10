import Link from "next/link";

const quickLinks = [
  { label: "Officer hub", href: "/dashboard" },
  { label: "Case docket", href: "/docket" },
  { label: "Tactical dashboard", href: "/review" },
  { label: "Field intel update", href: "/intel" },
];

const resourceLinks = [
  { label: "User manual", href: "/help/operations" },
  { label: "Data handling policy", href: "/help/evidence-support" },
  { label: "Contact NIC support", href: "/help/security-desk" },
  { label: "Audit trail", href: "/audit" },
];

interface NetraFooterProps {
  agencyName?: string;
  syncStatus?: string;
  lastUpdated?: string;
  classification?: string;
}

export default function NetraFooter({
  agencyName = "Federal Special Cell",
  syncStatus = "NIC GovCloud sync active",
  lastUpdated = "10 Sep 2026",
  classification = "Level-4 restricted SCI system",
}: NetraFooterProps) {
  return (
    <footer className="w-full bg-[#0a1420] px-8 pb-6 pt-8 text-[#B4B2A9]">
      <div className="grid grid-cols-1 gap-6 border-b border-white/10 pb-6 md:grid-cols-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xl text-[#5DCAA5]" aria-hidden="true">◎</span>
            <span className="text-[15px] font-medium text-[#F1F0EA]">Netra</span>
          </div>
          <p className="m-0 text-[13px] leading-relaxed text-[#9A9E9E]">
            National Investigation Intelligence Platform. Restricted access system for authorized law enforcement personnel only.
          </p>
        </div>

        <FooterColumn title="Quick links" links={quickLinks} />
        <FooterColumn title="Resources" links={resourceLinks} />

        <div>
          <p className="mb-2.5 text-xs font-medium text-[#6B7280]">System status</p>
          <div className="mb-2 flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5DCAA5]" />
            <span className="text-[13px] text-[#B4B2A9]">{syncStatus}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#888780]" aria-hidden="true">🔒</span>
            <span className="text-[13px] text-[#B4B2A9]">AES-256 secured</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
        <p className="m-0 text-xs text-[#6B7280]">
          Content owned by {agencyName} · Developed and hosted by National Informatics Centre, Ministry of Electronics and Information Technology, Government of India
        </p>
        <div className="flex items-center gap-3.5">
          <Badge label="Powered by SWaaS" />
          <Badge label="NIC" />
          <Badge label="Digital India" />
        </div>
      </div>

      <p className="mb-0 mt-3 text-[11px] text-[#4B4F4F]">
        Last updated: {lastUpdated} · {classification}
      </p>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: typeof quickLinks }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-medium text-[#6B7280]">{title}</p>
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="text-[13px] text-[#B5D4F4] no-underline hover:underline">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return <span className="rounded border border-white/15 px-2 py-0.5 text-[11px] text-[#5F5E5A]">{label}</span>;
}
