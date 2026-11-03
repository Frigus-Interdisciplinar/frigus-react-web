import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { AppLayoutProps } from "@/types/component-props.type";
export type { AppLayoutProps } from "@/types/component-props.type";

export default function AppLayout({
  activeSection,
  title,
  subtitle,
  children,
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F5F8FC] dark:bg-[#0F1115] font-sans text-slate-800 dark:text-neutral-100 transition-colors">
      <Sidebar activeSection={activeSection} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={title}
          subtitle={subtitle}
          activeSection={activeSection}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1400px] flex-1 p-4 sm:p-6 md:p-9"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export { Topbar, Sidebar };
