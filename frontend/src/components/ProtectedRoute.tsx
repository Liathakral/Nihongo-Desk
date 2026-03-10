import { Navigate } from "react-router-dom";
import { authStore } from "../stores/authStore";
import type { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = authStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
