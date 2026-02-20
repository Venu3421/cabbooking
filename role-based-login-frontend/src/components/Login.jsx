import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8081/api/auth/login', formData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      localStorage.setItem("email", decoded.sub);
      const role = decoded.role;

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "hr") navigate("/hr-dashboard");
      else if (role === "it") navigate("/it-dashboard");
      else if (role === "driver") navigate("/driver-dashboard");
      else navigate("/");

    } catch (err) {
      alert(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="glass-card">
        <h2>Welcome Back</h2>
        <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>Login to your account to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <span style={{ color: "var(--text-light)" }}>Don't have an account? </span>
          <Link to="/reg" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
