import { Route } from "react-router-dom";
import LoginPage from "@/pages/Auth/Login";
import RegisterPage from "@/pages/Auth/Register";
import ForgotPasswordStep1 from "@/pages/Common/ForgotPasswordStep1";
import ForgotPasswordStep2 from "@/pages/Common/ForgotPasswordStep2";
import ForgotPasswordStep3 from "@/pages/Common/ForgotPasswordStep3";
import ChooseProfilePage from "@/pages/Common/ChooseProfilePage";
import PlansDomesticPage from "@/pages/Common/PlansDomesticPage";
import PlansCommercialPage from "@/pages/Common/PlansCommercialPage";
import PlansEnterprisePage from "@/pages/Common/PlansEnterprisePage";

export const authRoutes = (
  <>
    {/* Autenticação */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Fluxo de Recuperação de Senha (3 Etapas) */}
    <Route path="/forgot-password" element={<ForgotPasswordStep1 />} />
    <Route path="/recover-password/step-1" element={<ForgotPasswordStep1 />} />
    <Route path="/recover-password/step-2" element={<ForgotPasswordStep2 />} />
    <Route path="/recover-password/step-3" element={<ForgotPasswordStep3 />} />

    {/* Seleção de Perfil e Planos Comuns V2 */}
    <Route path="/choose-profile" element={<ChooseProfilePage />} />
    <Route path="/plans/domestic" element={<PlansDomesticPage />} />
    <Route path="/plans/commercial" element={<PlansCommercialPage />} />
    <Route path="/plans/enterprise" element={<PlansEnterprisePage />} />
  </>
);
