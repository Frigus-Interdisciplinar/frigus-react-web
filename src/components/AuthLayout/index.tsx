import AuthSidebar from "./AuthSidebar";
import type { AuthLayoutProps } from "@/types/component-props.type";
export type { AuthLayoutProps } from "@/types/component-props.type";

export default function AuthLayout({
  title,
  description,
  cardTitle,
  cardDescription,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden bg-[#F4F7FC] dark:bg-[#111214]">
      <AuthSidebar
        title={title}
        description={description}
        cardTitle={cardTitle}
        cardDescription={cardDescription}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="min-w-0 flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}
