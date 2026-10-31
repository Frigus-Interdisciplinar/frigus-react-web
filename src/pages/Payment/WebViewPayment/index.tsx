import { Navigate, useSearchParams } from "react-router-dom";

export default function WebViewPayment() {
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams({
    plan: searchParams.get("plan") || "family-plus",
  });
  return <Navigate to={`/checkout?${params.toString()}`} replace />;
}
