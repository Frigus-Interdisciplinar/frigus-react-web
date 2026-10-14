import { Route, Navigate } from "react-router-dom";
import CommercialStockPage from "@/pages/Commercial/Stock";
import CommercialValidityPage from "@/pages/Commercial/Validity";
import CommercialBatchDetailsPage from "@/pages/Commercial/BatchDetails";
import CommercialShoppingListPage from "@/pages/Commercial/ShoppingList";
import CommercialExpensesPage from "@/pages/Commercial/Expenses";
import CommercialWastePage from "@/pages/Commercial/Waste";
import CommercialMonthlyReportPage from "@/pages/Commercial/MonthlyReport";
import CommercialEmployeesPage from "@/pages/Commercial/Employees";
import AuthGuard from "@/components/AuthGuard";

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
