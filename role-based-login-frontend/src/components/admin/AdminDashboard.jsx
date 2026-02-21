import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchBookings(token);
    }
  }, [navigate]);

  const fetchBookings = async (token) => {
    setIsRefreshing(true);
    try {
      const response = await axios.get("http://localhost:8081/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const activeBookingsCount = bookings.filter(b => b.status === "ASSIGNED" || b.status === "IN PROGRESS").length;
  const completedBookingsCount = bookings.filter(b => b.status === "COMPLETED").length;

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ACTIVE') return b.status === "ASSIGNED" || b.status === "IN PROGRESS";
    if (filter === 'COMPLETED') return b.status === "COMPLETED";
    return true; // ALL
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Fleet Status Overview</h2>
          <p className="mt-1 text-slate-300">Live aggregated HR booking statuses and analytics.</p>
        </div>
        <button onClick={() => fetchBookings(localStorage.getItem('token'))} disabled={isRefreshing} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-white shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed" title="Refresh Data">
          <span className={`material-symbols-outlined text-[20px] ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          onClick={() => setFilter('ALL')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-6 shadow-xl transition-all cursor-pointer group ${filter === 'ALL' ? 'bg-white/15 border-white/30 scale-105' : 'bg-white/5 border-white/10 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20'}`}>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Bookings</p>
              <h3 className="mt-2 text-4xl font-bold text-white tracking-tight">{bookings.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-blue-300 border border-primary/20">
              <span className="material-symbols-outlined">list_alt</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('ACTIVE')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-6 shadow-xl transition-all cursor-pointer group ${filter === 'ACTIVE' ? 'bg-white/15 border-emerald-500/30 scale-105' : 'bg-white/5 border-white/10 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20'}`}>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Rides</p>
              <h3 className="mt-2 text-4xl font-bold text-white tracking-tight">{activeBookingsCount}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
              <span className="material-symbols-outlined">local_taxi</span>
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter('COMPLETED')}
          className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-6 shadow-xl transition-all cursor-pointer group ${filter === 'COMPLETED' ? 'bg-white/15 border-indigo-500/30 scale-105' : 'bg-white/5 border-white/10 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20'}`}>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-400">Completed Trips</p>
              <h3 className="mt-2 text-4xl font-bold text-white tracking-tight">{completedBookingsCount}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

        {/* HR Booking Monitor */}
        <div className="col-span-1">
          <div className="flex h-full flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel">
            <div className="flex items-center justify-between border-b border-white/10 p-6 bg-white/5">
              <h3 className="text-lg font-bold text-white drop-shadow-sm">HR Booking Log</h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE DATA
              </span>
            </div>
            <div className="flex-1 overflow-x-auto min-h-[300px]">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/20 text-xs uppercase text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Employee / Contact</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Route Info</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Booking Time</th>
                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No active bookings found.</td>
                    </tr>
                  ) : (
                    currentItems.map((booking) => (
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
                            <div className="flex flex-col text-sm text-slate-300">
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
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${booking.status === 'COMPLETED' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                            booking.status === 'IN PROGRESS' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                              'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            }`}>
                            {booking.status === 'COMPLETED' ? '✅ ' : booking.status === 'IN PROGRESS' ? '🚕 ' : '📅 '}
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
                <span className="text-sm text-slate-400">
                  Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredBookings.length)}</span> of <span className="text-white font-medium">{filteredBookings.length}</span> entries
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
