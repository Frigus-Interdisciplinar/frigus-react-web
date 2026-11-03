import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { domesticRoutes } from "./domestic.routes";
import { commercialRoutes } from "./commercial.routes";
import { enterpriseRoutes } from "./enterprise.routes";
import { paymentRoutes } from "./payment.routes";
import { useAuth } from "@/contexts/useAuth";
import {
  mobileScreenAliases,
  pendingMobileScreenAliases,
} from "./mobile-aliases";
import MobileScreenPendingPage from "@/pages/MobileScreenPending";
import WorkspaceLayout from "./WorkspaceLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getSessionDestination } from "@/utils/plan.util";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootEntry />} />
      <Route
        path="/mobile-screen-pending"
        element={<MobileScreenPendingPage />}
      />

      {authRoutes}

      {paymentRoutes}

      <Route element={<WorkspaceLayout />}>
        {domesticRoutes}
        {commercialRoutes}
        {enterpriseRoutes}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function RootEntry() {
  const { user, initialized } = useAuth();
  const [searchParams] = useSearchParams();
  const alias = searchParams.get("alias");
  const screenPath =
    alias && Object.hasOwn(mobileScreenAliases, alias)
      ? mobileScreenAliases[alias]
      : undefined;
  if (alias && !screenPath) {
    if (Object.hasOwn(pendingMobileScreenAliases, alias)) {
      const params = new URLSearchParams(searchParams);
      return (
        <Navigate to={`/mobile-screen-pending?${params.toString()}`} replace />
      );
    }
    return (
      <main
        id="main-content"
        tabIndex={-1}
        className="grid min-h-screen place-items-center bg-[#F5F8FC] p-6 text-center text-[#131C55]"
      >
        <div className="max-w-md rounded-3xl border border-[#E1E7F0] bg-white p-8 shadow-sm">
          <h1 className="font-montserrat text-xl font-bold">
            Alias não reconhecido
          </h1>
          <p className="mt-2 text-sm text-[#596B85]">
            Confira o alias ou volte ao início.
          </p>
          <Link
            to="/home"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2552C8] px-5 font-semibold text-white"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }
  if (!initialized && !screenPath)
    return (
      <LoadingSpinner label="Carregando sua sessão…" className="min-h-screen" />
    );
  const defaultPath = user ? getSessionDestination(user) : "/login";
  const params = new URLSearchParams(searchParams);
  const query = params.toString();
  return (
    <Navigate
      to={`${screenPath ?? defaultPath}${query ? `?${query}` : ""}`}
      replace
    />
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="grid min-h-screen place-items-center p-6 text-center text-frigus-navy dark:text-white"
    >
      <div className="space-y-4">
        <p className="font-semibold text-frigus-primary">Erro 404</p>
        <h1 className="text-3xl font-bold">Esta página não existe</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Confira o endereço ou volte para a página anterior.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg bg-frigus-primary px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-frigus-primary"
        >
          Voltar
        </button>
      </div>
    </main>
  );
}
