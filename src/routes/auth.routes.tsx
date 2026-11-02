import { Route } from "react-router-dom";
import { lazyPage } from "@/routes/lazyPage";
import AuthGuard from "@/components/AuthGuard";

const LoginPage = lazyPage(() => import("@/pages/Auth/Login"));
const RegisterPage = lazyPage(() => import("@/pages/Auth/Register"));
const ForgotPasswordStep1 = lazyPage(
  () => import("@/pages/Common/ForgotPasswordStep1"),
);
const ForgotPasswordStep2 = lazyPage(
  () => import("@/pages/Common/ForgotPasswordStep2"),
);
const ForgotPasswordStep3 = lazyPage(
  () => import("@/pages/Common/ForgotPasswordStep3"),
);
const ChooseProfilePage = lazyPage(
  () => import("@/pages/Common/ChooseProfilePage"),
);
const PlansDomesticPage = lazyPage(
  () => import("@/pages/Common/PlansDomesticPage"),
);
const PlansCommercialPage = lazyPage(
  () => import("@/pages/Common/PlansCommercialPage"),
);
const PlansEnterprisePage = lazyPage(
  () => import("@/pages/Common/PlansEnterprisePage"),
);

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordStep1 />} />
    <Route path="/recover-password/step-1" element={<ForgotPasswordStep1 />} />
    <Route path="/recover-password/step-2" element={<ForgotPasswordStep2 />} />
    <Route path="/recover-password/step-3" element={<ForgotPasswordStep3 />} />
    <Route
      path="/choose-profile"
      element={
        <AuthGuard allowPlanSelection>
          <ChooseProfilePage />
        </AuthGuard>
      }
    />
    <Route
      path="/plans/domestic"
      element={
        <AuthGuard allowPlanSelection accountType="DOMESTIC">
          <PlansDomesticPage />
        </AuthGuard>
      }
    />
    <Route
      path="/plans/commercial"
      element={
        <AuthGuard allowPlanSelection accountType="COMMERCIAL">
          <PlansCommercialPage />
        </AuthGuard>
      }
    />
    <Route
      path="/plans/enterprise"
      element={
        <AuthGuard allowPlanSelection accountType="BUSINESS">
          <PlansEnterprisePage />
        </AuthGuard>
      }
    />
  </>
);
