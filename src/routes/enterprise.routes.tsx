import { Navigate, Route } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { lazyPage } from "@/routes/lazyPage";

const EnterpriseOverviewPage = lazyPage(() => import("@/pages/Enterprise/Overview"));
const EnterpriseAdsPage = lazyPage(() => import("@/pages/Enterprise/Ads"));
const EnterpriseViewsPage = lazyPage(() => import("@/pages/Enterprise/Views"));

export const enterpriseRoutes = (
  <>
    <Route path="/enterprise" element={<AuthGuard accountType="BUSINESS"><EnterpriseOverviewPage /></AuthGuard>} />
    <Route path="/enterprise/ads" element={<AuthGuard accountType="BUSINESS"><EnterpriseAdsPage /></AuthGuard>} />
    <Route path="/enterprise/views" element={<AuthGuard accountType="BUSINESS"><EnterpriseViewsPage /></AuthGuard>} />
    <Route path="/enterprise/report" element={<AuthGuard accountType="BUSINESS"><Navigate to="/enterprise/views" replace /></AuthGuard>} />
    <Route path="/enterprise/audience" element={<AuthGuard accountType="BUSINESS"><Navigate to="/enterprise/views" replace /></AuthGuard>} />
  </>
);
