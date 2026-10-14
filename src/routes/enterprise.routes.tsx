import { Navigate, Route } from "react-router-dom";
import EnterpriseOverviewPage from "@/pages/Enterprise/Overview";
import EnterpriseAdsPage from "@/pages/Enterprise/Ads";
import EnterpriseViewsPage from "@/pages/Enterprise/Views";
import AuthGuard from "@/components/AuthGuard";

export const enterpriseRoutes = (
  <>
    <Route path="/enterprise" element={<AuthGuard accountType="BUSINESS"><EnterpriseOverviewPage /></AuthGuard>} />
    <Route path="/enterprise/ads" element={<AuthGuard accountType="BUSINESS"><EnterpriseAdsPage /></AuthGuard>} />
    <Route path="/enterprise/views" element={<AuthGuard accountType="BUSINESS"><EnterpriseViewsPage /></AuthGuard>} />
    <Route path="/enterprise/report" element={<AuthGuard accountType="BUSINESS"><Navigate to="/enterprise/views" replace /></AuthGuard>} />
    <Route path="/enterprise/audience" element={<AuthGuard accountType="BUSINESS"><Navigate to="/enterprise/views" replace /></AuthGuard>} />
  </>
);
