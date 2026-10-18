import { type ReactNode } from "react";
import Sidebar, { type SectionString } from "./Sidebar";
import Topbar from "./Topbar";

export type AppLayoutProps = {
  activeSection?: SectionString;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AppLayout({
  activeSection,
  title,
  subtitle,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F8FC] dark:bg-[#0F1115] font-sans text-slate-800 dark:text-neutral-100 transition-colors">
      {/* Sidebar fixo */}
      <Sidebar activeSection={activeSection} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} activeSection={activeSection} />
        <main className="flex-1 p-6 md:p-9 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export { Topbar, Sidebar };
