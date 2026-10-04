import { Route, Navigate } from "react-router-dom";
import CommercialStockPage from "@/pages/Commercial/Stock";
import CommercialValidityPage from "@/pages/Commercial/Validity";
import CommercialBatchDetailsPage from "@/pages/Commercial/BatchDetails";
import CommercialShoppingListPage from "@/pages/Commercial/ShoppingList";
import CommercialExpensesPage from "@/pages/Commercial/Expenses";
import CommercialWastePage from "@/pages/Commercial/Waste";
import CommercialMonthlyReportPage from "@/pages/Commercial/MonthlyReport";
import CommercialEmployeesPage from "@/pages/Commercial/Employees";

export const commercialRoutes = (
  <>
    <Route path="/commercial" element={<Navigate to="/commercial/stock" replace />} />
    <Route path="/commercial/stock" element={<CommercialStockPage />} />
    <Route path="/commercial/stock/:id" element={<CommercialBatchDetailsPage />} />
    <Route path="/commercial/validity" element={<CommercialValidityPage />} />
    <Route path="/commercial/shopping-list" element={<CommercialShoppingListPage />} />
    <Route path="/commercial/monthly-report" element={<CommercialMonthlyReportPage />} />
    <Route path="/commercial/waste" element={<CommercialWastePage />} />
    <Route path="/commercial/expenses" element={<CommercialExpensesPage />} />
    <Route path="/commercial/employees" element={<CommercialEmployeesPage />} />
  </>
);
