import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [editForm, setEditForm] = useState({ mobileNumber: "", name: "", cabType: "" });
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8081/api/admin/view-drivers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Failed to fetch drivers", error);
    }
  };

  const handleEditClick = (driver) => {
    setCurrentDriver(driver);
    setEditForm({
      mobileNumber: driver.mobileNumber || "",
      name: driver.name || "",
      cabType: driver.cabType || "Cab"
    });
    setEditMessage("");
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:8081/api/admin/edit-driver/${currentDriver.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditMessage({ type: "success", text: "Driver updated successfully!" });
      fetchDrivers(); // Refresh list
      setTimeout(() => setIsEditing(false), 1500); // Close modal after short delay
    } catch (error) {
      console.error("Failed to update driver", error);
      setEditMessage({ type: "error", text: "Failed to update driver." });
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>👨‍✈️ All Registered Drivers</h2>
        <Link to="/admin-dashboard" className="btn btn-default" style={{ backgroundColor: "var(--default-bg)", color: "var(--default-text)", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3>Total Drivers</h3>
          <div className="metric-value">{drivers.length}</div>
        </div>
        <div className="metric-card">
          <h3>Available Drivers</h3>
          <div className="metric-value" style={{ color: "var(--success-text)" }}>
            {drivers.filter(d => d.available).length}
          </div>
        </div>
        <div className="metric-card">
          <h3>On Trip</h3>
          <div className="metric-value" style={{ color: "var(--warning-text)" }}>
            {drivers.filter(d => !d.available).length}
          </div>
        </div>
      </div>

      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Vehicle Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No drivers registered</td></tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id}>
                  <td>#{d.id}</td>
                  <td style={{ fontWeight: "500" }}>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{d.mobileNumber || <span style={{ color: "var(--danger-text)", fontSize: "0.85em" }}>Missing</span>}</td>
                  <td>{d.cabType}</td>
                  <td>
                    {d.available ? (
                      <span className="status-badge status-success">✅ Available</span>
                    ) : (
                      <span className="status-badge status-warning">🚕 On Trip</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditClick(d)}
                      className="btn btn-default"
                      style={{ padding: "6px 12px", fontSize: "0.9rem" }}
                    >
                      ✎ Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal Overlay */}
      {isEditing && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div className="glass-card" style={{ width: "100%", maxWidth: "500px", position: "relative" }}>
            <button
              onClick={() => setIsEditing(false)}
              style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-light)" }}
            >
              ×
            </button>
            <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--text-dark)" }}>Edit Driver: {currentDriver?.name}</h3>

            {editMessage && (
              <div style={{ padding: "10px", borderRadius: "8px", marginBottom: "15px", backgroundColor: editMessage.type === "success" ? "var(--success-bg)" : "var(--danger-bg)", color: editMessage.type === "success" ? "var(--success-text)" : "var(--danger-text)" }}>
                {editMessage.text}
              </div>
            )}

            <form onSubmit={submitEdit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" className="form-control" value={editForm.name} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label>Mobile Number (SMS)</label>
                <input type="tel" name="mobileNumber" className="form-control" placeholder="+1234567890" value={editForm.mobileNumber} onChange={handleEditChange} required />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select name="cabType" className="form-control" value={editForm.cabType} onChange={handleEditChange}>
                  <option value="Cab">Cab</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewDrivers;
