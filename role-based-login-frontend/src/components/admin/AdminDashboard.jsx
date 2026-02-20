import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Weather from "../Weather";
import ThemeToggle from "../ThemeToggle";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8081/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const activeBookings = bookings.filter(b => b.status === "ASSIGNED" || b.status === "IN PROGRESS").length;
  const completedBookings = bookings.filter(b => b.status === "COMPLETED").length;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>👑 Admin Dashboard</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <ThemeToggle />
          <Weather />
          <Link to="/admin/add-driver" className="btn btn-primary">➕ Add Driver</Link>
          <Link to="/admin/view-drivers" className="btn btn-primary">👨‍✈️ View Drivers</Link>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="metric-card">
          <h3>Total Bookings</h3>
          <div className="metric-value">{bookings.length}</div>
        </div>
        <div className="metric-card">
          <h3>Active Trips</h3>
          <div className="metric-value" style={{ color: "var(--warning-text)" }}>{activeBookings}</div>
        </div>
        <div className="metric-card">
          <h3>Completed Trips</h3>
          <div className="metric-value" style={{ color: "var(--success-text)" }}>{completedBookings}</div>
        </div>
      </div>

      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Time</th>
              <th>Cab</th>
              <th>Date</th>
              <th>Status</th>
              <th>HR Email</th>
              <th>Driver</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: "center" }}>No bookings found</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td style={{ fontWeight: "500" }}>{booking.employeeName}</td>
                  <td>{booking.pickup}</td>
                  <td>{booking.dropLocation}</td>
                  <td>{booking.pickupTime}</td>
                  <td>{booking.cabType}</td>
                  <td>{booking.bookingDate}</td>
                  <td>
                    <span className={`status-badge ${booking.status === "COMPLETED" ? "status-success" : booking.status === "CANCELLED" ? "status-danger" : booking.status === "IN PROGRESS" ? "status-warning" : "status-info"}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.hrEmail}</td>
                  <td>{booking.driverEmail || "Unassigned"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
