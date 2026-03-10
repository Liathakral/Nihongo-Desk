import { useState } from "react";
import api from "../api/client";
import { authStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const setAuth = authStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // 1️⃣ Login → get access token
    const loginRes = await api.post("/auth/login", {
      email,
      password,
    });

    const accessToken = loginRes.data.access_token;

    // ✅ SAVE TOKEN FIRST
    authStore.getState().setAuth(null, accessToken);

    const meRes = await api.get("/auth/me");

    authStore.getState().setAuth(meRes.data, accessToken);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF6F0] flex items-center justify-center">
      <div className="w- bg-[#FDEAE5] p-9 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Welcome back 
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
          className="w-full bg-[#C2C3F3] cursor-pointer py-2 rounded-lg font-medium"
        >
          Login
        </button>
        <div className=" flex items-center justify-center p-3">
          {" "}
          <h1 className=" font-semibold text-amber-900">
            Don't have an account ?
          </h1>{" "}
          <button
            className=" p-2  overflow-hidden rounded-3xl cursor-pointer font-semibold text-blue-800/50   "
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
