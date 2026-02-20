import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    console.log("HR Email from localStorage:", email);

    try {
      const res = await axios.get(`http://localhost:8081/api/hr/mybookings?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch HR bookings", err);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8081/api/hr/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling booking", error);
      alert("Failed to cancel booking");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesName = b.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate ? b.bookingDate === filterDate : true;
    return matchesName && matchesDate;
  });

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>📋 My Cab Bookings</h2>
        <Link to="/hr-dashboard" className="btn btn-default" style={{ backgroundColor: "var(--default-bg)", color: "var(--default-text)", textDecoration: "none" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap", backgroundColor: "var(--card-bg)", padding: "20px", borderRadius: "var(--border-radius)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--form-border)" }}>
        <input
          type="text"
          placeholder="Search Employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ maxWidth: "250px" }}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="form-control"
          style={{ maxWidth: "200px" }}
        />
        <button className="btn btn-default" style={{ height: "46px" }} onClick={() => { setSearchTerm(""); setFilterDate(""); }}>Clear Filters</button>
      </div>

      <div className="modern-table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Route</th>
              <th>Time & Date</th>
              <th>Cab Type</th>
              <th>Driver</th>
              <th>Status Progress</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No bookings found.</td></tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: "500" }}>{b.employeeName}</td>
                  <td>
                    <div style={{ fontSize: "0.9em", color: "var(--text-light)" }}>From: <span style={{ color: "var(--text-dark)" }}>{b.pickup}</span></div>
                    <div style={{ fontSize: "0.9em", color: "var(--text-light)" }}>To: <span style={{ color: "var(--text-dark)" }}>{b.dropLocation}</span></div>
                  </td>
                  <td>
                    <div>{b.pickupTime}</div>
                    <div style={{ fontSize: "0.85em", color: "var(--text-light)" }}>{b.bookingDate}</div>
                  </td>
                  <td>{b.cabType}</td>
                  <td>{b.driverEmail || <span style={{ color: "var(--text-light)", fontStyle: "italic" }}>Not Assigned</span>}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span className={`status-badge ${b.status === "COMPLETED" ? "status-success" : b.status === "CANCELLED" ? "status-danger" : b.status === "IN PROGRESS" ? "status-warning" : "status-info"}`}>
                        {b.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    {b.status !== "CANCELLED" && b.status !== "COMPLETED" && b.status !== "IN PROGRESS" && (
                      <button className="btn btn-danger" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
