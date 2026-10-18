import { Route } from "react-router-dom";
import AuthGuard from "@/components/AuthGuard";
import { lazyPage } from "@/routes/lazyPage";

const CheckoutPage = lazyPage(() => import("@/pages/Payment/CheckoutPage"));
const WebViewSuccess = lazyPage(() => import("@/pages/Payment/WebViewSuccess"));
const WebViewError = lazyPage(() => import("@/pages/Payment/WebViewError"));

export const paymentRoutes = [
  <Route key="checkout" path="/checkout" element={<AuthGuard><CheckoutPage /></AuthGuard>} />,
  <Route key="checkout-webview" path="/checkout/webview" element={<AuthGuard><CheckoutPage /></AuthGuard>} />,
  <Route key="checkout-webview-success" path="/checkout/webview/success" element={<AuthGuard><WebViewSuccess /></AuthGuard>} />,
  <Route key="checkout-webview-error" path="/checkout/webview/error" element={<AuthGuard><WebViewError /></AuthGuard>} />,
];
