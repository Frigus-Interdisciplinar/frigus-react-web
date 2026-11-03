import { Outlet, useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import type { SectionString } from "@/types/component-props.type";
import CommercialLayout from "@/components/CommercialLayout";
import type { CommercialSection } from "@/types/component-props.type";
import EnterpriseLayout from "@/components/EnterpriseLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useStore } from "@/store/store";

const domesticSections: Record<string, SectionString> = {
  home: "home",
  stock: "stock",
  alerts: "alerts",
  recipe: "recipe",
  "shopping-list": "shopping-list",
  "family-members": "family-members",
  chat: "chat",
  "chat-ai": "chat-ai",
  profile: "profile",
  settings: "settings",
  plans: "plans",
  notifications: "notifications",
};

const commercialSections: Record<
  string,
  { section: CommercialSection; label: string }
> = {
  stock: { section: "stock", label: "Estoque" },
  validity: { section: "validity", label: "Validades" },
  "shopping-list": { section: "shopping-list", label: "Lista de compras" },
  "monthly-report": { section: "monthly-report", label: "Relatório mensal" },
  waste: { section: "waste", label: "Desperdícios" },
  expenses: { section: "expenses", label: "Gastos e compras" },
  employees: { section: "employees", label: "Funcionários" },
};

const enterpriseSections = {
  overview: { section: "overview", label: "Visão geral" },
  ads: { section: "ads", label: "Produtos anunciados" },
  report: { section: "report", label: "Relatório mensal" },
  views: { section: "views", label: "Visualizações" },
  audience: { section: "audience", label: "Público atingido" },
} as const;

// The shell stays mounted while the outlet restores the session, loads a chunk or fetches data.
export default function WorkspaceLayout() {
  const { pathname } = useLocation();
  const [, area, tab] = pathname.split("/");
  const user = useStore((state) => state.user);
  const initialized = useStore((state) => state.initialized);

  const sharedWorkspaceLabels: Record<string, string> = {
    profile: "Perfil",
    settings: "Configurações",
    notifications: "Notificações",
  };
  const sharedLabel = sharedWorkspaceLabels[area];

  if (sharedLabel && !initialized) {
    return <LoadingSpinner label="Carregando sua sessão…" className="min-h-screen" />;
  }

  if (sharedLabel && user?.accountType === "COMMERCIAL") {
    return (
      <CommercialLayout
        activeSection={area as CommercialSection}
        breadcrumb={`Área comercial    /    ${sharedLabel}`}
      >
        <Outlet />
      </CommercialLayout>
    );
  }

  if (sharedLabel && user?.accountType === "BUSINESS") {
    return (
      <EnterpriseLayout
        activeSection={area as "profile" | "settings" | "notifications"}
        breadcrumb={`Área empresarial    /    ${sharedLabel}`}
      >
        <Outlet />
      </EnterpriseLayout>
    );
  }

  if (sharedLabel && !user) return <Outlet />;

  if (area === "commercial") {
    const { section, label } =
      commercialSections[tab] ?? commercialSections.stock;
    return (
      <CommercialLayout
        activeSection={section}
        breadcrumb={`Área comercial    /    ${label}`}
      >
        <Outlet />
      </CommercialLayout>
    );
  }

  if (area === "enterprise") {
    const { section, label } =
      enterpriseSections[tab as keyof typeof enterpriseSections] ??
      enterpriseSections.overview;
    return (
      <EnterpriseLayout
        activeSection={section}
        breadcrumb={`Área empresarial    /    ${label}`}
      >
        <Outlet />
      </EnterpriseLayout>
    );
  }

  return (
    <AppLayout
      activeSection={domesticSections[area]}
      title={area === "chat-ai" ? "Chat IA" : undefined}
      subtitle={
        area === "chat-ai" ? "Converse com o assistente Frigus" : undefined
      }
    >
      <Outlet />
    </AppLayout>
  );
}
