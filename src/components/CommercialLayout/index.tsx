import { type ReactNode } from "react";
import CommercialSidebar, { type CommercialSection } from "./CommercialSidebar";
import CommercialTopbar from "./CommercialTopbar";

export interface CommercialLayoutProps {
  activeSection?: CommercialSection;
  breadcrumb?: string;
  children: ReactNode;
}

export default function CommercialLayout({
  activeSection,
  breadcrumb,
  children,
}: CommercialLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FB] dark:bg-[#0F1115] font-sans text-[#141C55] dark:text-neutral-100">
      {/* Sidebar fixo Comercial */}
      <CommercialSidebar activeSection={activeSection} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <CommercialTopbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export { CommercialSidebar, CommercialTopbar };
