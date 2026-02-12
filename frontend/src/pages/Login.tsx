import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";

const Login = () => {
  const { showToast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showToast(error.response?.data?.message || "Login failed");
      } else {
        showToast("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Inventory SaaS</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg focus:outline-none focus:ring-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
