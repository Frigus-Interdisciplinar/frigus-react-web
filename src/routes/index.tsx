import { Routes, Route, Navigate } from "react-router-dom";
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

      {/* Fallback, implementar page NOT FOUND */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
