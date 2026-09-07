import React from "react";
import Sidebar, { type SectionString } from "@/components/Sidebar/Navbar";
import Topbar from "./Topbar";

type AppLayoutProps = {
  activeSection?: SectionString;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AppLayout({
  activeSection,
  title,
  subtitle,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg-app font-sans text-text-main">
      {/* Sidebar fixo */}
      <Sidebar activeSection={activeSection} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
