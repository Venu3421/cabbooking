import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HrDashBoard() {
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    try {
      // Fetch HR's specific bookings
      const bookingsRes = await axios.get(`http://localhost:8081/api/hr/mybookings?email=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookingsRes.data || []);

      // Fetch all drivers to show available ones
      const driversRes = await axios.get("http://localhost:8081/api/admin/view-drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(driversRes.data || []);

    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate Metrics
  const today = new Date().toDateString();
  const activeRides = bookings.filter(b => b.status === "ASSIGNED" || b.status === "IN PROGRESS").length;
  const pendingRequests = bookings.filter(b => !b.status || b.status === "PENDING" || b.status.toUpperCase() === "NEW").length;
  const completedToday = bookings.filter(b => b.status === "COMPLETED" && new Date(b.bookingDate || b.bookingTime || new Date()).toDateString() === today).length;

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ACTIVE') return b.status === "ASSIGNED" || b.status === "IN PROGRESS";
    if (filter === 'PENDING') return !b.status || b.status === "PENDING" || b.status.toUpperCase() === "NEW";
    if (filter === 'COMPLETED') return b.status === "COMPLETED" && new Date(b.bookingDate || b.bookingTime || new Date()).toDateString() === today;
    return true;
  });

  const availableDrivers = drivers.filter(d => d.available);

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-6">

      {/* Header section with Book Cab Now button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">System Overview</h2>
          <p className="mt-1 text-slate-300">Monitor your recent cab assignments and active rides.</p>
        </div>
        <Link to="/hr/book-cab" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 whitespace-nowrap">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Book Cab Now
        </Link>
      </div>

      {/* 4 Metric Boxes (added 'ALL' to reset logic easily) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* All Bookings */}
        <div
          onClick={() => setFilter('ALL')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-5 shadow-xl transition-all cursor-pointer ${filter === 'ALL' ? 'bg-primary/20 border-primary shadow-primary/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Bookings</p>
              <h3 className="mt-1 text-3xl font-bold text-white tracking-tight">{bookings.length}</h3>
            </div>
          </div>
        </div>

        {/* Active Rides */}
        <div
          onClick={() => setFilter('ACTIVE')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-5 shadow-xl transition-all cursor-pointer ${filter === 'ACTIVE' ? 'bg-emerald-500/20 border-emerald-500 shadow-emerald-500/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-medium text-slate-400">Active Rides</p>
              <h3 className="mt-1 text-3xl font-bold text-white tracking-tight">{activeRides}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        <div
          onClick={() => setFilter('PENDING')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-5 shadow-xl transition-all cursor-pointer ${filter === 'PENDING' ? 'bg-amber-500/20 border-amber-500 shadow-amber-500/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-medium text-slate-400">Pending Requests</p>
              <h3 className="mt-1 text-3xl font-bold text-white tracking-tight">{pendingRequests}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/20">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div
          onClick={() => setFilter('COMPLETED')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-5 shadow-xl transition-all cursor-pointer ${filter === 'COMPLETED' ? 'bg-indigo-500/20 border-indigo-500 shadow-indigo-500/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-medium text-slate-400">Completed Today</p>
              <h3 className="mt-1 text-3xl font-bold text-white tracking-tight">{completedToday}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cab Booking Table Container */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel h-full min-h-[400px]">
          <div className="flex items-center justify-between border-b border-white/10 p-6 bg-white/5">
            <h3 className="text-lg font-bold text-white drop-shadow-sm text-shadow">Employee Bookings</h3>
            <Link to="/hr/my-bookings" className="text-sm text-primary-light hover:text-white transition-colors">View All &rarr;</Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-black/20 text-xs uppercase text-slate-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold tracking-wider">Employee</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Route Info</th>
                  <th className="px-6 py-4 font-semibold tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 font-semibold tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">Loading data...</td></tr>
                ) : filteredBookings.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No bookings match the selected filter.</td></tr>
                ) : (
                  filteredBookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white tracking-wide">{booking.employeeName}</span>
                          <span className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">call</span>
                            {booking.employeeMobileNumber || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <div className="w-0.5 h-3 bg-white/10"></div>
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          </div>
                          <div className="flex flex-col text-sm text-slate-300 gap-0.5">
                            <span className="font-medium text-white">{booking.pickup || 'HQ'}</span>
                            <span className="font-medium text-slate-400">{booking.dropLocation || 'Destination'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-200">{booking.bookingDate || new Date(booking.bookingTime).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-400">{booking.pickupTime || new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === "COMPLETED" ? (
                          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                            <span className="material-symbols-outlined text-[14px] font-bold">check_circle</span>
                            {booking.status}
                          </div>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border shadow-sm ${booking.status === "IN PROGRESS" ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                              'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            }`}>
                            {booking.status === 'IN PROGRESS' ? '🚕 ' : '📅 '}
                            {booking.status || 'PENDING'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Drivers Section Container */}
        <div className="lg:col-span-1 flex flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel h-full min-h-[400px]">
          <div className="flex items-center justify-between border-b border-white/10 p-6 bg-white/5">
            <h3 className="text-lg font-bold text-white drop-shadow-sm text-shadow flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">local_taxi</span>
              Available Drivers
            </h3>
            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-slate-300">{availableDrivers.length} Online</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="text-center text-slate-400 py-8">Loading drivers...</div>
            ) : availableDrivers.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">No drivers currently available.</div>
            ) : (
              availableDrivers.map(driver => (
                <div key={driver.id} className="bg-black/20 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-black/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white border border-slate-600">
                      {driver.name ? driver.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{driver.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">directions_car</span>
                        {driver.cabType}
                      </p>
                    </div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default HrDashBoard;
