//Login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Error & loading state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ====================================
  // HANDLE LOGIN FORM SUBMISSION
  // ====================================
  const handleSubmit = async (e) => {
    // Prevent the form from refreshing the page
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send login request to the backend
      const response = await api.post("/auth/login", { email, password });

      // Store the token and user info in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userId", response.data._id);

      // Redirect to the home page
      navigate("/");
      // Reload to update the navbar
      window.location.reload();
    } catch (error) {
      // Show the error message from the backend
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Decorative icon */}
        <div className="auth-icon">
          <div className="auth-icon-circle">🔐</div>
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue to your blog</p>

        {/* Show error message if login fails */}
        {error && <p className="error-message">⚠ {error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                className="has-icon"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="input-icon">✉</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                className="has-icon"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
