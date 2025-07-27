import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, registerLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.username) newErrors.username = "Username is required";
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (form.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Register user with the new API
    register({
      username: form.username,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
    });
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
          <h2 className="text-2xl font-bold text-blue-100 mb-2 text-center">Sign Up</h2>
          
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className={`px-4 py-2 rounded-lg bg-blue-100/10 border text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 w-full ${
                errors.username ? 'border-red-400' : 'border-blue-300/30'
              }`}
              disabled={registerLoading}
              required
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className={`px-4 py-2 rounded-lg bg-blue-100/10 border text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 w-full ${
                errors.firstName ? 'border-red-400' : 'border-blue-300/30'
              }`}
              disabled={registerLoading}
              required
            />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className={`px-4 py-2 rounded-lg bg-blue-100/10 border text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 w-full ${
                errors.lastName ? 'border-red-400' : 'border-blue-300/30'
              }`}
              disabled={registerLoading}
              required
            />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`px-4 py-2 rounded-lg bg-blue-100/10 border text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 w-full ${
                errors.email ? 'border-red-400' : 'border-blue-300/30'
              }`}
              disabled={registerLoading}
              required
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={`px-4 py-2 rounded-lg bg-blue-100/10 border text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 w-full ${
                errors.password ? 'border-red-400' : 'border-blue-300/30'
              }`}
              disabled={registerLoading}
              required
              minLength={6}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            <p className="text-blue-200 text-xs mt-1">
              Password must contain at least 6 characters, including uppercase, lowercase, and number
            </p>
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`px-4 py-2 rounded-lg bg-blue-100/10 border text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200 w-full ${
                errors.confirmPassword ? 'border-red-400' : 'border-blue-300/30'
              }`}
              disabled={registerLoading}
              required
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-400 hover:to-blue-600 transition-all duration-300"
            disabled={registerLoading}
          >
            {registerLoading ? "Creating Account..." : "Sign Up"}
          </Button>
          <div className="text-center mt-2">
            <span className="text-blue-200 text-sm">Already have an account? </span>
            <Link to="/login" className="text-blue-400 hover:text-blue-200 underline text-sm">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
