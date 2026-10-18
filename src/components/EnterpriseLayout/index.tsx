import type { ReactNode } from "react";
import EnterpriseSidebar from "./EnterpriseSidebar";
import EnterpriseTopbar from "./EnterpriseTopbar";

interface EnterpriseLayoutProps {
  children: ReactNode;
  activeSection?: "overview" | "ads" | "report" | "views" | "audience";
  breadcrumb?: string;
  onOpenCreateAd?: () => void;
}

export default function EnterpriseLayout({
  children,
  activeSection = "overview",
  breadcrumb,
  onOpenCreateAd,
}: EnterpriseLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#111214] text-[#141C55] dark:text-white flex font-plus-jakarta antialiased selection:bg-blue-900 selection:text-white transition-colors">
      {/* Sidebar */}
      <EnterpriseSidebar activeSection={activeSection} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <EnterpriseTopbar
          breadcrumb={breadcrumb}
          onOpenCreateAd={onOpenCreateAd}
        />

        <main className="p-6 md:p-9 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
