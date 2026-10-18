import { Route } from "react-router-dom";
import { lazyPage } from "@/routes/lazyPage";

const LoginPage = lazyPage(() => import("@/pages/Auth/Login"));
const RegisterPage = lazyPage(() => import("@/pages/Auth/Register"));
const ForgotPasswordStep1 = lazyPage(() => import("@/pages/Common/ForgotPasswordStep1"));
const ForgotPasswordStep2 = lazyPage(() => import("@/pages/Common/ForgotPasswordStep2"));
const ForgotPasswordStep3 = lazyPage(() => import("@/pages/Common/ForgotPasswordStep3"));
const ChooseProfilePage = lazyPage(() => import("@/pages/Common/ChooseProfilePage"));
const PlansDomesticPage = lazyPage(() => import("@/pages/Common/PlansDomesticPage"));
const PlansCommercialPage = lazyPage(() => import("@/pages/Common/PlansCommercialPage"));
const PlansEnterprisePage = lazyPage(() => import("@/pages/Common/PlansEnterprisePage"));

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordStep1 />} />
    <Route path="/recover-password/step-1" element={<ForgotPasswordStep1 />} />
    <Route path="/recover-password/step-2" element={<ForgotPasswordStep2 />} />
    <Route path="/recover-password/step-3" element={<ForgotPasswordStep3 />} />
    <Route path="/choose-profile" element={<ChooseProfilePage />} />
    <Route path="/plans/domestic" element={<PlansDomesticPage />} />
    <Route path="/plans/commercial" element={<PlansCommercialPage />} />
    <Route path="/plans/enterprise" element={<PlansEnterprisePage />} />
  </>
);
