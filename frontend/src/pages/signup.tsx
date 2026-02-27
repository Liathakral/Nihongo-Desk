import { useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSignup = async () => {
    await api.post("/auth/signup", { email, password });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF6F0]">
      <div className="w-80 bg-[#EDEBFF] p-6 rounded-2xl shadow-lg">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Create account 🌱
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
          onClick={handleSignup}
          className="w-full bg-[#EDC4D6] py-2 rounded-lg font-medium"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
