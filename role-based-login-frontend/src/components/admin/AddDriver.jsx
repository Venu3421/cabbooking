import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddDriver = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    cabType: "Cab",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:8081/api/admin/add-driver", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: res.data });
      setForm({ name: "", email: "", cabType: "Cab" });
    } catch (error) {
      console.error("Driver add failed", error);
      setMessage({ type: "error", text: "Failed to add driver" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", marginBottom: "20px" }}>
        <Link to="/admin-dashboard" className="btn btn-default" style={{ backgroundColor: "var(--default-bg)", color: "var(--default-text)", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="glass-card">
        <h2>➕ Add New Driver</h2>
        <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>Register a new driver into the system</p>

        {message && (
          <div style={{
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            backgroundColor: message.type === "success" ? "var(--success-bg)" : "var(--danger-bg)",
            color: message.type === "success" ? "var(--success-text)" : "var(--danger-text)",
            fontWeight: "500"
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Driver Name</label>
            <input
              name="name"
              className="form-control"
              placeholder="Enter driver name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Driver Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter driver email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="cabType" className="form-control" value={form.cabType} onChange={handleChange}>
              <option value="Cab">Cab</option>
              <option value="Van">Van</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
            {loading ? "Adding Driver..." : "Add Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
