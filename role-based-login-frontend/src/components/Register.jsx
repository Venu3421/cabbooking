import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
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
      const res = await axios.post('http://localhost:8081/api/auth/register', formData);
      alert(res.data);
      navigate("/");
    } catch (err) {
      alert(err.response?.data || 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="glass-card">
        <h2>Create an Account</h2>
        <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>Join us to manage cab bookings easily</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

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
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" className="form-control" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="it">IT</option>
              <option value="hr">HR</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <span style={{ color: "var(--text-light)" }}>Already have an account? </span>
          <Link to="/" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
