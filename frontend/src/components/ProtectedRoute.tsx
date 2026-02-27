import { Navigate } from "react-router-dom";
import { authStore } from "../stores/authStore";

export default function ProtectedRoute({ children }) {
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
