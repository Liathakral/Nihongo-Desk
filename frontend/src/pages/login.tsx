import { useState } from "react";
import api from "../api/client";
import { authStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = authStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 1️⃣ Login → get access token
    const loginRes = await api.post("/auth/login", {
      email,
      password,
    });

    const accessToken = loginRes.data.access_token;
    console.log("Access Token:", accessToken);
    // 2️⃣ Fetch user info
    const meRes = await api.get("/auth/me");

    // 3️⃣ Save auth state
    setAuth(meRes.data, accessToken);

    // 4️⃣ Go to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF6F0] flex items-center justify-center">
      <div className="w- bg-[#FDEAE5] p-6 rounded-2xl shadow-lg">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Welcome back 🌸
        </h1>

        <input
          className="w-full mb-3 p-2 rounded-lg border"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 rounded-lg border"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-[#C2C3F3] py-2 rounded-lg font-medium"
        >
          Login
        </button>
      </div>
    </div>
  );
}
