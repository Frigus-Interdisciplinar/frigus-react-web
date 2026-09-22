import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas de Autenticação
import LoginPage from "@/pages/Auth/Login";
import RegisterPage from "@/pages/Auth/Register";
import ForgotPasswordPage from "@/pages/Auth/ForgotPassword";

// Páginas Domésticas
import HomePage from "@/pages/Domestic/Home";
import StockPage from "@/pages/Domestic/Stock";
import FoodDetailsPage from "@/pages/Domestic/FoodDetails";
import AlertsPage from "@/pages/Domestic/Alerts";
import RecipePage from "@/pages/Domestic/Recipe";
import RecipeDetailsPage from "@/pages/Domestic/RecipeDetails";
import ShoppingListPage from "@/pages/Domestic/ShoppingList";
import FamilyMembersPage from "@/pages/Domestic/FamilyMembers";
import ChatPage from "@/pages/Domestic/Chat";
import ProfilePage from "@/pages/Domestic/Profile";
import SettingsPage from "@/pages/Domestic/Settings";
import PlansPage from "@/pages/Domestic/Plans";
import NotificationsPage from "@/pages/Domestic/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rotas Domésticas */}
        <Route path="/home" element={<HomePage />} />
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