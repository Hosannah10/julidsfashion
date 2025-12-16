import React, { useState } from "react";
import "./styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { DUMMY_BASE } from "../services/api";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${DUMMY_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        await response.text();
        showToast("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Expected API: { token: "jwt-access-token", user: { id, name, email } }
      if (data.token && data.user) {
        login(data.token, data.user);
        showToast(`Welcome back, ${data.user.name || "User"}!`);
        setTimeout(() => navigate("/"), 800);
      } else {
        showToast("Unexpected response format from server.");
      }
    } catch (error) {
      console.error(error);
      showToast("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card fade-in">
        <h1>Welcome Back</h1>
        <p className="subtitle">Login to continue your JuliD’s experience</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
