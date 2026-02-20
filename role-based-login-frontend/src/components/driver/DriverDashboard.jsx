import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Weather from "../Weather";
import ThemeToggle from "../ThemeToggle";

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const fetchMyTrips = async () => {
    const token = localStorage.getItem("token");
    const driverEmail = localStorage.getItem("email"); // already stored during login

    try {
      const response = await axios.get(`http://localhost:8081/api/driver/mytrips?email=${driverEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching driver trips", error);
    }
  };

  const handleStartTrip = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8081/api/driver/start-trip/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyTrips(); // Refresh list
    } catch (error) {
      console.error("Error starting trip", error);
      alert("Failed to start trip");
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8081/api/driver/complete-trip/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyTrips(); // Refresh list
    } catch (error) {
      console.error("Error completing trip", error);
      alert("Failed to complete trip");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const activeTrips = trips.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED");
  const historyTrips = trips.filter(t => t.status === "COMPLETED" || t.status === "CANCELLED");

  const displayTrips = activeTab === "active" ? activeTrips : historyTrips;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>🚗 Driver Dashboard</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <ThemeToggle />
          <Weather />
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3>Total Trips</h3>
          <div className="metric-value">{trips.length}</div>
        </div>
        <div className="metric-card">
          <h3>Active Trips</h3>
          <div className="metric-value" style={{ color: "var(--warning-text)" }}>{activeTrips.length}</div>
        </div>
        <div className="metric-card">
          <h3>Completed Trips</h3>
          <div className="metric-value" style={{ color: "var(--success-text)" }}>
            {trips.filter(t => t.status === "COMPLETED").length}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          className={`btn ${activeTab === "active" ? "btn-primary" : "btn-default"}`}
          style={{ backgroundColor: activeTab !== "active" ? "var(--default-bg)" : undefined, color: activeTab !== "active" ? "var(--default-text)" : undefined }}
          onClick={() => setActiveTab("active")}
        >
          Active Trips
        </button>
        <button
          className={`btn ${activeTab === "history" ? "btn-primary" : "btn-default"}`}
          style={{ backgroundColor: activeTab !== "history" ? "var(--default-bg)" : undefined, color: activeTab !== "history" ? "var(--default-text)" : undefined }}
          onClick={() => setActiveTab("history")}
        >
          Trip History
        </button>
      </div>

      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Route</th>
              <th>Time</th>
              <th>Cab Type</th>
              <th>Status</th>
              {activeTab === "active" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {displayTrips.length === 0 ? (
              <tr><td colSpan={activeTab === "active" ? 7 : 6} style={{ textAlign: "center" }}>No trips found in this section.</td></tr>
            ) : (
              displayTrips.map((trip) => (
                <tr key={trip.id}>
                  <td>#{trip.id}</td>
                  <td style={{ fontWeight: "500" }}>{trip.employeeName}</td>
                  <td>
                    <div style={{ fontSize: "0.9em", color: "var(--text-light)" }}>From: <span style={{ color: "var(--text-dark)" }}>{trip.pickup}</span></div>
                    <div style={{ fontSize: "0.9em", color: "var(--text-light)" }}>To: <span style={{ color: "var(--text-dark)" }}>{trip.dropLocation}</span></div>
                  </td>
                  <td>{trip.pickupTime}</td>
                  <td>{trip.cabType}</td>
                  <td>
                    <span className={`status-badge ${trip.status === "COMPLETED" ? "status-success" : trip.status === "IN PROGRESS" ? "status-warning" : trip.status === "CANCELLED" ? "status-danger" : "status-info"}`}>
                      {trip.status}
                    </span>
                  </td>
                  {activeTab === "active" && (
                    <td>
                      {trip.status === "ASSIGNED" && (
                        <button className="btn btn-primary" onClick={() => handleStartTrip(trip.id)}>Start Trip</button>
                      )}
                      {trip.status === "IN PROGRESS" && (
                        <button className="btn btn-success" onClick={() => handleCompleteTrip(trip.id)}>Complete Trip</button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverDashboard;
