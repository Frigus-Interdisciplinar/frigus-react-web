import { type ReactNode } from "react";
import AuthSidebar from "./AuthSidebar";

export interface AuthLayoutProps {
  title: ReactNode;
  description: ReactNode;
  cardTitle: string;
  cardDescription: ReactNode;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  description,
  cardTitle,
  cardDescription,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen w-screen bg-[#F4F7FC]">
      {/* Painel Institucional Lateral */}
      <AuthSidebar
        title={title}
        description={description}
        cardTitle={cardTitle}
        cardDescription={cardDescription}
      />

      {/* Conteúdo Principal / Card de Autenticação */}
      <section className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {children}
      </section>
    </main>
  );
}
