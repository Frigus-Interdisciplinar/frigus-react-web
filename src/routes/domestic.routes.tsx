import { Navigate, Route } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { lazyPage } from "@/routes/lazyPage";

const HomePage = lazyPage(() => import("@/pages/Domestic/Home"));
const StockPage = lazyPage(() => import("@/pages/Domestic/Stock"));
const FoodDetailsPage = lazyPage(() => import("@/pages/Domestic/FoodDetails"));
const AlertsPage = lazyPage(() => import("@/pages/Domestic/Alerts"));
const RecipePage = lazyPage(() => import("@/pages/Domestic/Recipe"));
const RecipeDetailsPage = lazyPage(
  () => import("@/pages/Domestic/RecipeDetails"),
);
const ShoppingListPage = lazyPage(
  () => import("@/pages/Domestic/ShoppingList"),
);
const FamilyMembersPage = lazyPage(
  () => import("@/pages/Domestic/FamilyMembers"),
);
const ChatPage = lazyPage(() => import("@/pages/Domestic/Chat"));
const AiChatPage = lazyPage(() => import("@/pages/Domestic/AiChat"));
const ProfilePage = lazyPage(() => import("@/pages/Domestic/Profile"));
const ProfileEditPage = lazyPage(() => import("@/pages/Domestic/ProfileEdit"));
const SettingsPage = lazyPage(() => import("@/pages/Domestic/Settings"));
const NotificationsPage = lazyPage(
  () => import("@/pages/Domestic/Notifications"),
);

export const domesticRoutes = (
  <>
    <Route
      path="/home"
      element={
        <AuthGuard accountType="DOMESTIC">
          <HomePage />
        </AuthGuard>
      }
    />
    <Route
      path="/stock"
      element={
        <AuthGuard accountType="DOMESTIC">
          <StockPage />
        </AuthGuard>
      }
    />
    <Route
      path="/stock/:id"
      element={
        <AuthGuard accountType="DOMESTIC">
          <FoodDetailsPage />
        </AuthGuard>
      }
    />
    <Route
      path="/alerts"
      element={
        <AuthGuard accountType="DOMESTIC">
          <AlertsPage />
        </AuthGuard>
      }
    />
    <Route
      path="/recipe"
      element={
        <AuthGuard accountType="DOMESTIC">
          <RecipePage />
        </AuthGuard>
      }
    />
    <Route
      path="/recipe/:id"
      element={
        <AuthGuard accountType="DOMESTIC">
          <RecipeDetailsPage />
        </AuthGuard>
      }
    />
    <Route
      path="/shopping-list"
      element={
        <AuthGuard accountType="DOMESTIC">
          <ShoppingListPage />
        </AuthGuard>
      }
    />
    <Route
      path="/family-members"
      element={
        <AuthGuard accountType="DOMESTIC">
          <FamilyMembersPage />
        </AuthGuard>
      }
    />
    <Route
      path="/chat"
      element={
        <AuthGuard accountType="DOMESTIC">
          <ChatPage />
        </AuthGuard>
      }
    />
    <Route
      path="/chat-ai"
      element={
        <AuthGuard accountType="DOMESTIC">
          <AiChatPage />
        </AuthGuard>
      }
    />
    <Route
      path="/profile"
      element={
        <AuthGuard>
          <ProfilePage />
        </AuthGuard>
      }
    />
    <Route
      path="/profile/edit"
      element={
        <AuthGuard>
          <ProfileEditPage />
        </AuthGuard>
      }
    />
    <Route
      path="/settings"
      element={
        <AuthGuard>
          <SettingsPage />
        </AuthGuard>
      }
    />
    <Route
      path="/plans"
      element={
        <AuthGuard>
          <Navigate to="/plans/domestic" replace />
        </AuthGuard>
      }
    />
    <Route
      path="/notifications"
      element={
        <AuthGuard>
          <NotificationsPage />
        </AuthGuard>
      }
    />
  </>
);
