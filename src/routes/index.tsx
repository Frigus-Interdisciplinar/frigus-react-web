import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { domesticRoutes } from "./domestic.routes";
import { commercialRoutes } from "./commercial.routes";
import { enterpriseRoutes } from "./enterprise.routes";
import { paymentRoutes } from "./payment.routes";
import { useStore } from "@/store/store";

export default function AppRoutes() {
  const user = useStore((state) => state.user);
  return (
    <Routes>
      {/* Redirecionamento da raiz */}
      <Route path="/" element={<Navigate to={user?.accountType === "COMMERCIAL" ? "/commercial" : user?.accountType === "BUSINESS" ? "/enterprise" : user ? "/home" : "/login"} replace />} />

      {/* Módulo de Autenticação e Telas Comuns */}
      {authRoutes}

      {/* Módulo de Pagamento e WebViews */}
      {paymentRoutes}

      {/* Módulo Doméstico */}
      {domesticRoutes}

      {/* Módulo Comercial */}
      {commercialRoutes}

      {/* Módulo Empresarial */}
      {enterpriseRoutes}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center text-frigus-navy dark:text-white">
      <div className="space-y-4">
        <p className="font-semibold text-frigus-primary">Erro 404</p>
        <h1 className="text-3xl font-bold">Esta página não existe</h1>
        <p className="text-gray-600 dark:text-gray-300">Confira o endereço ou volte para a página anterior.</p>
        <button type="button" onClick={() => navigate(-1)} className="rounded-lg bg-frigus-primary px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frigus-primary">Voltar</button>
      </div>
    </main>
  );
}
