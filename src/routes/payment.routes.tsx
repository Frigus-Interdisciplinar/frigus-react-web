import { Route } from "react-router-dom";
import CheckoutPage from "@/pages/Payment/CheckoutPage";
import WebViewPayment from "@/pages/Payment/WebViewPayment";
import WebViewSuccess from "@/pages/Payment/WebViewSuccess";
import WebViewError from "@/pages/Payment/WebViewError";

export const paymentRoutes = [
  <Route key="checkout" path="/checkout" element={<CheckoutPage />} />,
  <Route key="checkout-webview" path="/checkout/webview" element={<WebViewPayment />} />,
  <Route key="checkout-webview-success" path="/checkout/webview/success" element={<WebViewSuccess />} />,
  <Route key="checkout-webview-error" path="/checkout/webview/error" element={<WebViewError />} />,
];
