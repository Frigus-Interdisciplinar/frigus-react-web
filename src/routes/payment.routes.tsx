import { Route } from "react-router-dom";
import CheckoutPage from "@/pages/Payment/CheckoutPage";
import WebViewSuccess from "@/pages/Payment/WebViewSuccess";
import WebViewError from "@/pages/Payment/WebViewError";
import AuthGuard from "@/components/AuthGuard";

export const paymentRoutes = [
  <Route key="checkout" path="/checkout" element={<AuthGuard><CheckoutPage /></AuthGuard>} />,
  <Route key="checkout-webview" path="/checkout/webview" element={<AuthGuard><CheckoutPage /></AuthGuard>} />,
  <Route key="checkout-webview-success" path="/checkout/webview/success" element={<AuthGuard><WebViewSuccess /></AuthGuard>} />,
  <Route key="checkout-webview-error" path="/checkout/webview/error" element={<AuthGuard><WebViewError /></AuthGuard>} />,
];
