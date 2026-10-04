import { Route } from "react-router-dom";
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

export const domesticRoutes = (
  <>
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
  </>
);
