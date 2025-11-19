import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/forgot-password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setEmail("");
      } else {
        setError(data.message || "Failed to process request");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2>Forgot Password</h2>
          <p className="subtitle">Enter your email to reset your password</p>

          {error && (
            <div style={{
              backgroundColor: "#fee",
              color: "#c33",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              backgroundColor: "#efe",
              color: "#3c3",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>

          <p className="signup">
            Remember your password? <Link to="/Login">Login</Link>
          </p>
          <p className="signup">
            Don't have an account? <Link to="/SignUp">Sign up</Link>
          </p>
        </div>

        <div className="login-right">
          <div className="image-placeholder">
            <img src="/logo.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;