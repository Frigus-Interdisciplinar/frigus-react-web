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
    <div className="flex min-h-screen bg-[#F5F8FC] dark:bg-[#111214] font-sans text-[#141C55] dark:text-neutral-100">
      <CommercialSidebar activeSection={activeSection} />

      <div className="flex-1 flex flex-col min-w-0">
        <CommercialTopbar breadcrumb={breadcrumb} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-6 md:p-9 max-w-[1440px] w-full mx-auto space-y-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export { CommercialSidebar, CommercialTopbar };
