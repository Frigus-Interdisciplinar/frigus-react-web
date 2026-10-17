import type { ReactNode } from "react";
import Sidebar, { type SectionString } from "@/components/Sidebar/Navbar";

export default function WorkspaceLayout({ activeSection, title, subtitle, children }: { activeSection: SectionString; title: string; subtitle?: string; children: ReactNode }) {
  return <div className="min-h-screen bg-[#F6F8FC] text-frigus-navy md:flex"><Sidebar activeSection={activeSection}/><main className="min-w-0 flex-1 p-5 md:p-8"><header className="mb-7"><p className="text-sm font-semibold text-frigus-primary">Frigus</p><h1 className="mt-1 text-3xl font-bold">{title}</h1>{subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}</header>{children}</main></div>;
}
