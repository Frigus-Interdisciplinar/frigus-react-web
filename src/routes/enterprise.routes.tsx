import { Route } from "react-router-dom";
import EnterpriseOverviewPage from "@/pages/Enterprise/Overview";
import EnterpriseAdsPage from "@/pages/Enterprise/Ads";
import EnterpriseMonthlyReportPage from "@/pages/Enterprise/MonthlyReport";
import EnterpriseViewsPage from "@/pages/Enterprise/Views";
import EnterpriseAudiencePage from "@/pages/Enterprise/Audience";

export const enterpriseRoutes = (
  <>
    <Route path="/enterprise" element={<EnterpriseOverviewPage />} />
    <Route path="/enterprise/ads" element={<EnterpriseAdsPage />} />
    <Route path="/enterprise/report" element={<EnterpriseMonthlyReportPage />} />
    <Route path="/enterprise/views" element={<EnterpriseViewsPage />} />
    <Route path="/enterprise/audience" element={<EnterpriseAudiencePage />} />
  </>
);
