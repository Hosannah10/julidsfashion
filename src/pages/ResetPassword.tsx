import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/ResetPassword.css";
import { DUMMY_BASE } from "../services/api";
import { useToast } from "../context/ToastContext";

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1) try ?token=...
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get("token");

    if (tokenParam) {
      setToken(tokenParam);
      return;
    }

    // 2) fallback: try to parse token from last path segment e.g. /reset-password/<uid>-<token>
    const pathname = location.pathname || "";
    const parts = pathname.split("/");
    const last = parts[parts.length - 1] || parts[parts.length - 2]; // handle trailing slash
    if (last && last.includes("-")) {
      setToken(last);
      return;
    }

    setToken(null);
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setIsSuccess(false);
      return;
    }

    if (!token) {
      setMessage("Invalid or missing reset token.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${DUMMY_BASE}/auth/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setMessage("Your password has been reset successfully!");
        setIsSuccess(true);
        setFormData({ password: "", confirmPassword: "" });
        showToast("Password reset successful. Please login.");
        setTimeout(() => navigate("/login"), 1400);
      } else {
        const error = await response.json().catch(() => ({}));
        setMessage(error.detail || error.message || "Failed to reset password.");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reset-container">
      <div className="reset-card">
        <h1>Reset Your Password</h1>
        <p>Please enter and confirm your new password below.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className={`reset-message ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;
