import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "@/store/store";
export default function RequireAuth({ children }: { children: ReactNode }) {
  return useStore((state) => state.user) ? children : <Navigate to="/login" replace/>;
}
