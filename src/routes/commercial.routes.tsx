import { Route, Navigate } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { lazyPage } from "@/routes/lazyPage";

const CommercialStockPage = lazyPage(() => import("@/pages/Commercial/Stock"));
const CommercialValidityPage = lazyPage(() => import("@/pages/Commercial/Validity"));
const CommercialBatchDetailsPage = lazyPage(() => import("@/pages/Commercial/BatchDetails"));
const CommercialShoppingListPage = lazyPage(() => import("@/pages/Commercial/ShoppingList"));
const CommercialExpensesPage = lazyPage(() => import("@/pages/Commercial/Expenses"));
const CommercialWastePage = lazyPage(() => import("@/pages/Commercial/Waste"));
const CommercialMonthlyReportPage = lazyPage(() => import("@/pages/Commercial/MonthlyReport"));
const CommercialEmployeesPage = lazyPage(() => import("@/pages/Commercial/Employees"));

export const commercialRoutes = (
  <>
    <Route path="/commercial" element={<AuthGuard accountType="COMMERCIAL"><Navigate to="/commercial/stock" replace /></AuthGuard>} />
    <Route path="/commercial/stock" element={<AuthGuard accountType="COMMERCIAL"><CommercialStockPage /></AuthGuard>} />
    <Route path="/commercial/stock/:id" element={<AuthGuard accountType="COMMERCIAL"><CommercialBatchDetailsPage /></AuthGuard>} />
    <Route path="/commercial/validity" element={<AuthGuard accountType="COMMERCIAL"><CommercialValidityPage /></AuthGuard>} />
    <Route path="/commercial/shopping-list" element={<AuthGuard accountType="COMMERCIAL"><CommercialShoppingListPage /></AuthGuard>} />
    <Route path="/commercial/monthly-report" element={<AuthGuard accountType="COMMERCIAL"><CommercialMonthlyReportPage /></AuthGuard>} />
    <Route path="/commercial/waste" element={<AuthGuard accountType="COMMERCIAL"><CommercialWastePage /></AuthGuard>} />
    <Route path="/commercial/expenses" element={<AuthGuard accountType="COMMERCIAL"><CommercialExpensesPage /></AuthGuard>} />
    <Route path="/commercial/employees" element={<AuthGuard accountType="COMMERCIAL"><CommercialEmployeesPage /></AuthGuard>} />
  </>
);
