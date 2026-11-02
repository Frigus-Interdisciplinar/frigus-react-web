import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Início",
  "/login": "Entrar",
  "/register": "Criar conta",
  "/forgot-password": "Recuperar senha",
  "/recover-password/step-1": "Recuperar senha",
  "/recover-password/step-2": "Verificar código",
  "/recover-password/step-3": "Nova senha",
  "/choose-profile": "Escolher perfil",
  "/plans/domestic": "Planos Domésticos",
  "/plans/commercial": "Planos Comerciais",
  "/plans/enterprise": "Planos Empresariais",
  "/checkout": "Finalizar assinatura",
  "/checkout/success": "Pagamento confirmado",
  "/checkout/error": "Pagamento não concluído",
  "/checkout/webview": "Pagamento",
  "/checkout/webview/success": "Pagamento confirmado",
  "/checkout/webview/error": "Pagamento não concluído",
  "/mobile-screen-pending": "Tela em preparação",
  "/home": "Home Doméstico",
  "/stock": "Estoque Doméstico",
  "/alerts": "Alertas Domésticos",
  "/recipe": "Receitas Domésticas",
  "/shopping-list": "Lista de Compras Doméstica",
  "/family-members": "Membros da Família",
  "/chat": "Chat Familiar",
  "/chat-ai": "Chat IA",
  "/profile": "Perfil",
  "/settings": "Configurações",
  "/plans": "Planos",
  "/notifications": "Notificações",
  "/commercial": "Área Comercial",
  "/commercial/stock": "Estoque Comercial",
  "/commercial/validity": "Validades Comerciais",
  "/commercial/shopping-list": "Lista de Compras Comercial",
  "/commercial/monthly-report": "Relatório Mensal Comercial",
  "/commercial/waste": "Desperdícios Comerciais",
  "/commercial/expenses": "Gastos e Compras Comerciais",
  "/commercial/employees": "Funcionários",
  "/enterprise": "Visão Geral Empresarial",
  "/enterprise/ads": "Produtos Anunciados",
  "/enterprise/report": "Relatório Empresarial",
  "/enterprise/views": "Visualizações Empresariais",
  "/enterprise/audience": "Público Empresarial",
};

const dynamicTitles: Array<[RegExp, string]> = [
  [/^\/stock\/[^/]+$/, "Detalhes do Alimento"],
  [/^\/recipe\/[^/]+$/, "Detalhes da Receita"],
  [/^\/commercial\/stock\/[^/]+$/, "Detalhes do Lote Comercial"],
];

function getPageTitle(pathname: string) {
  const title =
    dynamicTitles.find(([pattern]) => pattern.test(pathname))?.[1] ??
    titles[pathname] ??
    "Página não encontrada";
  return `Frigus - ${title}`;
}

export default function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getPageTitle(pathname);
  }, [pathname]);

  return null;
}
