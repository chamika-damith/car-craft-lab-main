import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loginLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return;
    }

    login(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-8 right-0">
          {/* Optionally add a close button here if needed */}
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full flex flex-col gap-6 border border-blue-200/20 animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-blue-100 mb-2 text-center">Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-blue-100/10 border border-blue-300/30 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
            disabled={loginLoading}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg bg-blue-100/10 border border-blue-300/30 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
            disabled={loginLoading}
            required
          />
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-400 hover:to-blue-600 transition-all duration-300"
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-center mt-2">
            <span className="text-blue-200 text-sm">Don't have an account? </span>
            <Link to="/signup" className="text-blue-400 hover:text-blue-200 underline text-sm">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
