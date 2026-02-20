import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Weather from "./Weather";
import ThemeToggle from "./ThemeToggle";

function HrDashBoard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "10px" }}>
        <h2 style={{ margin: 0 }}>👩‍💼 HR Dashboard</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <ThemeToggle />
          <Weather />
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>

      <p style={{ color: "var(--text-light)", marginBottom: "30px", fontSize: "1.1rem" }}>
        Welcome back! Manage your employee cab bookings efficiently.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
        <Link to="/hr/book-cab" style={{ textDecoration: "none" }}>
          <div className="metric-card" style={{ padding: "40px 20px", height: "100%", justifyContent: "flex-start" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>🚕</div>
            <h3 style={{ color: "var(--text-dark)", margin: "0", fontSize: "1.5rem" }}>Book a Cab</h3>
            <p style={{ color: "var(--text-light)", marginTop: "10px", fontSize: "1rem" }}>Schedule a ride for an employee</p>
          </div>
        </Link>

        <Link to="/hr/my-bookings" style={{ textDecoration: "none" }}>
          <div className="metric-card" style={{ padding: "40px 20px", height: "100%", justifyContent: "flex-start" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>📋</div>
            <h3 style={{ color: "var(--text-dark)", margin: "0", fontSize: "1.5rem" }}>View Bookings</h3>
            <p style={{ color: "var(--text-light)", marginTop: "10px", fontSize: "1rem" }}>Track all employee rides and assignees</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
export default HrDashBoard;
