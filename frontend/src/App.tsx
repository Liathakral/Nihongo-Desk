import { useEffect } from "react";
import api from "./api/client";
import { authStore } from "./stores/authStore";
import {  Route, Routes,Navigate } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/Mainlayout";
export default function App() {
  const setAuth = authStore((s: AuthStore) => s.setAuth);
  const setUnauthenticated = authStore((s: AuthStore) => s.setUnauthenticated);
useEffect(() => {
  let mounted = true;

  const restoreSession = async () => {
    try {
      // 1️⃣ Always refresh first
      const refresh = await api.post("/auth/refresh");
      const accessToken = refresh.data.access_token;

      if (!mounted) return;

      // temporarily set token
      setAuth(null, accessToken);

      // 2️⃣ Now fetch user
      const me = await api.get("/auth/me");

      if (mounted) {
        setAuth(me.data, accessToken);
      }

    } catch {
      if (mounted) {
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
          <Route path="/analytics"/>
          <Route path="/chatbot"/>
           {/* <Route path="/dailyplans"/> */}

        </Route>

       
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
