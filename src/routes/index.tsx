import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { domesticRoutes } from "./domestic.routes";
import { commercialRoutes } from "./commercial.routes";
import { paymentRoutes } from "./payment.routes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Redirecionamento da raiz */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Módulo de Autenticação e Telas Comuns */}
      {authRoutes}

      {/* Módulo de Pagamento e WebViews */}
      {paymentRoutes}

      {/* Módulo Doméstico */}
      {domesticRoutes}

      {/* Módulo Comercial */}
      {commercialRoutes}

      {/* Fallback, implementar page NOT FOUND */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
