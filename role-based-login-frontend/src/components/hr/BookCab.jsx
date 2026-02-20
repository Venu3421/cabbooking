import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Weather from "../Weather";

const BookCab = () => {
  const [form, setForm] = useState({
    employeeName: "",
    employeeMobileNumber: "",
    pickup: "",
    dropLocation: "",
    pickupTime: "",
    cabType: "Cab",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const hrEmail = localStorage.getItem("email");

    try {
      const response = await axios.post("http://localhost:8081/api/hr/book", {
        ...form,
        hrEmail: hrEmail,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage({ type: "success", text: response.data });
      setForm({ employeeName: "", employeeMobileNumber: "", pickup: "", dropLocation: "", pickupTime: "", cabType: "Cab" });
    } catch (error) {
      console.error("Booking failed", error);
      setMessage({ type: "error", text: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "var(--default-bg)", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Unified Header Section */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <Link to="/hr-dashboard" className="btn" style={{
            backgroundColor: "var(--card-bg)",
            color: "var(--text-dark)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--form-border)"
          }}>
            ← Back to Dashboard
          </Link>
          <Weather />
        </div>

        {/* Page Title & Status */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>Taxi Dispatch</h2>
          <p style={{ color: "var(--text-light)", fontSize: "1.1rem" }}>Schedule a ride for an employee</p>

          {message && (
            <div style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: message.type === "success" ? "var(--success-bg)" : "var(--danger-bg)",
              color: message.type === "success" ? "var(--success-text)" : "var(--danger-text)",
              border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontSize: "1.2rem" }}>{message.type === "success" ? "✓" : "⚠️"}</span>
              {message.text}
            </div>
          )}
        </div>

        <form onSubmit={handleBook}>
          {/* Passenger Section */}
          <div style={{
            backgroundColor: "var(--card-bg)",
            padding: "30px",
            borderRadius: "var(--border-radius)",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "24px",
            border: "1px solid var(--table-border)"
          }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--text-dark)", marginBottom: "20px", borderBottom: "1px solid var(--form-border)", paddingBottom: "10px" }}>
              Passenger Information
            </h3>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: "0.95rem", color: "var(--text-light)" }}>Employee Name</label>
              <input
                type="text"
                name="employeeName"
                className="form-control"
                placeholder="Enter employee's full name"
                value={form.employeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, marginTop: "15px" }}>
              <label style={{ fontSize: "0.95rem", color: "var(--text-light)" }}>Employee Mobile Number (For SMS)</label>
              <input
                type="tel"
                name="employeeMobileNumber"
                className="form-control"
                placeholder="+1234567890"
                value={form.employeeMobileNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "30px" }}>

            {/* Origin Section */}
            <div style={{
              backgroundColor: "var(--card-bg)",
              padding: "30px",
              borderRadius: "var(--border-radius)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--table-border)"
            }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-dark)", marginBottom: "20px", borderBottom: "1px solid var(--form-border)", paddingBottom: "10px" }}>
                1. Origin
              </h3>
              <div className="form-group">
                <label style={{ fontSize: "0.95rem", color: "var(--text-light)" }}>Pickup Location</label>
                <input
                  type="text"
                  name="pickup"
                  className="form-control"
                  placeholder="Street, City, or Building"
                  value={form.pickup}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "0.95rem", color: "var(--text-light)" }}>Pickup Time</label>
                <input
                  type="time"
                  name="pickupTime"
                  className="form-control"
                  value={form.pickupTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Destination/Details Section */}
            <div style={{
              backgroundColor: "var(--card-bg)",
              padding: "30px",
              borderRadius: "var(--border-radius)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--table-border)"
            }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--text-dark)", marginBottom: "20px", borderBottom: "1px solid var(--form-border)", paddingBottom: "10px" }}>
                2. Destination & Details
              </h3>
              <div className="form-group">
                <label style={{ fontSize: "0.95rem", color: "var(--text-light)" }}>Drop Location</label>
                <input
                  type="text"
                  name="dropLocation"
                  className="form-control"
                  placeholder="Street, City, or Building"
                  value={form.dropLocation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: "0.95rem", color: "var(--text-light)" }}>Vehicle Type</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="cabType"
                    className="form-control"
                    value={form.cabType}
                    onChange={handleChange}
                    style={{ appearance: "none", backgroundColor: "var(--form-bg)", color: "var(--text-dark)", border: "1px solid var(--form-border)" }}
                  >
                    <option value="Cab">Standard Cab</option>
                    <option value="Van">Minivan (6+ seats)</option>
                  </select>
                  <div style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    ▼
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Call to Action Row */}
          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--form-border)", paddingTop: "24px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: "14px 32px",
                fontSize: "1.1rem",
                borderRadius: "30px",
                minWidth: "200px"
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookCab;
