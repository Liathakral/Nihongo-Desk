import { useEffect } from "react";
import api from "./api/client";
import { authStore } from "./stores/authStore";
import {  Route, Routes,Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/ProtectedRoute";
import StudySessionForm from "./pages/StudySessionForm";
import DashboardPage from "./components/dashboard";
import MainLayout from "./layouts/Mainlayout";
export default function App() {
  const setAuth = authStore((s) => s.setAuth);
  const setUnauthenticated = authStore((s) => s.setUnauthenticated);
useEffect(() => {
  let mounted = true;

  const restoreSession = async () => {
    try {
      const me = await api.get("/auth/me");
      if (mounted) {
      setAuth(me.data, authStore.getState().accessToken);
      }
    } catch {
      try {
        const refresh = await api.post("/auth/refresh");
       setAuth(null, refresh.data.access_token);

        const me = await api.get("/auth/me");
        if (mounted) {
          setAuth(me.data, refresh.data.access_token);
        }
      } catch {
        setUnauthenticated();
      }
    }
  };

  restoreSession();

  return () => {
    mounted = false;
  };
}, []);


  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

       <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
   <Route path="/dashboard" />
          <Route path="/study" />
          <Route path="timeline"/>

        </Route>

       
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
