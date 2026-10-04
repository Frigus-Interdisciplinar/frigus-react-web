import { BrowserRouter } from "react-router-dom";
import AppRoutes from "@/routes";
import { ThemeProvider } from "@/context";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}