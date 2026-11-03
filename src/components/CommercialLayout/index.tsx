import CommercialSidebar from "./CommercialSidebar";
import CommercialTopbar from "./CommercialTopbar";
import type { CommercialLayoutProps } from "@/types/layout-component-props.type";
export type { CommercialLayoutProps } from "@/types/layout-component-props.type";

export default function CommercialLayout({
  activeSection,
  breadcrumb,
  userName,
  onLogout,
  children,
}: CommercialLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F8FC] dark:bg-[#111214] font-sans text-[#141C55] dark:text-neutral-100">
      <CommercialSidebar activeSection={activeSection} userName={userName} />

      <div className="flex-1 flex flex-col min-w-0">
        <CommercialTopbar
          breadcrumb={breadcrumb}
          userName={userName}
          onLogout={onLogout}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1440px] flex-1 space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-9"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export { CommercialSidebar, CommercialTopbar };
