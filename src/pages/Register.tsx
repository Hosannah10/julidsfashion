import React, { useState } from "react";
import "./styles/Register.css";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";
import { DUMMY_BASE } from "../services/api";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${DUMMY_BASE}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        await response.text();
        showToast("Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.token && data.user) {
        login(data.token, data.user);
        showToast(`Welcome to JuliD’s Fashion World, ${data.user.name || "User"}!`);
        setTimeout(() => navigate("/"), 800);
      } else {
        showToast("Unexpected response format from server.");
      }
    } catch (error) {
      console.error(error);
      showToast("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card fade-in">
        <h1>Create Account</h1>
        <p className="subtitle">Join JuliD’s Fashion World today</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/register">Login here</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
