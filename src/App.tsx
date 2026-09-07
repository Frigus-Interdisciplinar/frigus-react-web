import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Páginas Domésticas
import DashboardPage from "./pages/DashboardPage";
import StockPage from "./pages/StockPage";
import FoodDetailsPage from "./pages/FoodDetailsPage";
import AlertsPage from "./pages/AlertsPage";
import RecipePage from "./pages/RecipePage";
import RecipeDetailsPage from "./pages/RecipeDetailsPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import FamilyMembersPage from "./pages/FamilyMembersPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PlansPage from "./pages/PlansPage";
import NotificationsPage from "./pages/NotificationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rotas Domésticas */}
        <Route path="/home" element={<DashboardPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/stock/:id" element={<FoodDetailsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/family-members" element={<FamilyMembersPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}