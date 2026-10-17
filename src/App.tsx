import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import PlansPage from "./pages/PlansPage";
import HomePage from "./pages/HomePage";
import StockPage from "./pages/StockPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import RecipePage from "./pages/RecipePage";
import FamilyPage from "./pages/FamilyPage";
import CommercialPage from "./pages/CommercialPage";
import { useEffect, useState } from "react";
import { profileService } from "@/services/profile.service";
import { useStore } from "@/store/store";

export default function App() {
  const [checkingSession, setCheckingSession] = useState(true);
  useEffect(() => {
    let active = true;
    profileService.get().then((user) => {
      if (active) useStore.setState({ user });
    }).catch(() => {
      if (active) useStore.getState().logout();
    }).finally(() => {
      if (active) setCheckingSession(false);
    });
    return () => { active = false; };
  }, []);
  if (checkingSession) return <p role="status" className="p-8 text-frigus-navy">Verificando sessão...</p>;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={useStore.getState().user ? "/home" : "/login"} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/shopping-list" element={<ShoppingListPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/family-members" element={<FamilyPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/commercial" element={<CommercialPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
