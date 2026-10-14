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
import AuthGuard from "@/components/AuthGuard";

export const domesticRoutes = (
  <>
    <Route path="/home" element={<AuthGuard accountType="DOMESTIC"><HomePage /></AuthGuard>} />
    <Route path="/stock" element={<AuthGuard accountType="DOMESTIC"><StockPage /></AuthGuard>} />
    <Route path="/stock/:id" element={<AuthGuard accountType="DOMESTIC"><FoodDetailsPage /></AuthGuard>} />
    <Route path="/alerts" element={<AuthGuard accountType="DOMESTIC"><AlertsPage /></AuthGuard>} />
    <Route path="/recipe" element={<AuthGuard accountType="DOMESTIC"><RecipePage /></AuthGuard>} />
    <Route path="/recipe/:id" element={<AuthGuard accountType="DOMESTIC"><RecipeDetailsPage /></AuthGuard>} />
    <Route path="/shopping-list" element={<AuthGuard accountType="DOMESTIC"><ShoppingListPage /></AuthGuard>} />
    <Route path="/family-members" element={<AuthGuard accountType="DOMESTIC"><FamilyMembersPage /></AuthGuard>} />
    <Route path="/chat" element={<AuthGuard accountType="DOMESTIC"><ChatPage /></AuthGuard>} />
    <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
    <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
    <Route path="/plans" element={<AuthGuard><PlansPage /></AuthGuard>} />
    <Route path="/notifications" element={<AuthGuard><NotificationsPage /></AuthGuard>} />
  </>
);
