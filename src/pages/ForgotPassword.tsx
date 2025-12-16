import React, { useState } from "react";
import "./styles/ForgotPassword.css";
import { useToast } from "../context/ToastContext";
import { DUMMY_BASE } from "../services/api";

const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // tell backend where to redirect user for reset; backend will append uid-token
      const frontendUrl = window.location.origin; // e.g. "https://your-site.com"
      const res = await fetch(`${DUMMY_BASE}/auth/forgot-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frontend_url: frontendUrl }),
      });

      if (res.ok) {
        showToast("✅ Password reset link sent! Check your inbox.");
        setSubmitted(true);
      } else {
        showToast("❌ Failed to send reset link. Try again later.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      showToast("⚠️ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forgot-container">
      <div className="forgot-card fade-in">
        {!submitted ? (
          <>
            <h1>Forgot Password?</h1>
            <p className="subtitle">
              Enter your registered email address below. We’ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="auth-footer">
              Remember your password? <a href="/login">Back to Login</a>
            </p>
          </>
        ) : (
          <div className="success-message">
            <h2>Check Your Email</h2>
            <p>
              If an account with <span>{email}</span> exists, a reset link has been sent.
            </p>
            <a href="/login" className="back-login">Return to Login</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ForgotPassword;
