import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDate]);

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

  // Pagination Logic 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6 pt-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-400 text-4xl">list_alt</span>
          My Cab Bookings
        </h2>
        <p className="mt-1 text-slate-300">Track and manage employee ride requests</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl glass-panel relative overflow-hidden">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="flex-1 relative z-10">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Search Employee</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Enter name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
            />
          </div>
        </div>

        <div className="relative z-10">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm [color-scheme:dark]"
          />
        </div>

        <div className="relative z-10 flex items-end">
          <button
            className="h-[42px] px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
            onClick={() => { setSearchTerm(""); setFilterDate(""); }}
          >
            <span className="material-symbols-outlined text-[18px]">clear_all</span>
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/20 text-xs uppercase text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">#</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Employee</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Pickup</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Drop Location</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Time & Date</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Driver</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{b.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white tracking-wide">{b.employeeName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        {b.employeeMobileNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">storefront</span>
                        <span className="text-slate-200">{b.pickup || "HQ"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">location_on</span>
                        <span className="text-slate-200">{b.dropLocation}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200">{b.bookingDate}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>
                          {b.pickupTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {b.driverEmail ? (
                        <span className="text-slate-300">{b.driverEmail}</span>
                      ) : (
                        <span className="text-slate-500 italic text-xs bg-black/20 px-2 py-1 rounded">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {b.status === "COMPLETED" ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                          <span className="material-symbols-outlined text-[14px] font-bold">check_circle</span>
                          {b.status}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border shadow-sm ${b.status === "CANCELLED" ? "bg-red-500/10 text-red-300 border-red-500/30" :
                            b.status === "IN PROGRESS" ? "bg-blue-500/10 text-blue-300 border-blue-500/30" :
                              "bg-amber-500/10 text-amber-300 border-amber-500/30"
                          }`}>
                          {b.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {b.status !== "CANCELLED" && b.status !== "COMPLETED" && b.status !== "IN PROGRESS" && (
                        <button
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg transition-all"
                          onClick={() => handleCancel(b.id)}
                        >
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          Cancel
                        </button>
                      )}
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
  );
};

export default MyBookings;
