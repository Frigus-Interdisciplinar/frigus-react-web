import EnterpriseSidebar from "./EnterpriseSidebar";
import EnterpriseTopbar from "./EnterpriseTopbar";
import type { EnterpriseLayoutProps } from "@/types/component-props.type";
export type { EnterpriseLayoutProps } from "@/types/component-props.type";

export default function EnterpriseLayout({
  children,
  activeSection = "overview",
  breadcrumb,
  onOpenCreateAd,
}: EnterpriseLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#111214] text-[#141C55] dark:text-white flex font-plus-jakarta antialiased selection:bg-blue-900 selection:text-white transition-colors">
      <EnterpriseSidebar activeSection={activeSection} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <EnterpriseTopbar
          breadcrumb={breadcrumb}
          onOpenCreateAd={onOpenCreateAd}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl flex-1 space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-9"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
