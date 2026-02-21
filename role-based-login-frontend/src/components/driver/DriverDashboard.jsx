import React, { useEffect, useState } from "react";
import axios from "axios";

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    fetchMyTrips();
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    const token = localStorage.getItem("token");
    const driverEmail = localStorage.getItem("email");
    try {
      const res = await axios.get(`http://localhost:8081/api/driver/status?email=${driverEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOnline(res.data);
    } catch (e) { console.error("Error fetching online status", e); }
  };

  const toggleStatus = async () => {
    const token = localStorage.getItem("token");
    const driverEmail = localStorage.getItem("email");
    const newStatus = !isOnline;
    try {
      await axios.put(`http://localhost:8081/api/driver/toggle-availability?email=${driverEmail}&available=${newStatus}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOnline(newStatus);
    } catch (e) { alert("Failed to change status"); }
  };

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

  const activeTrips = trips.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED");

  // Filter logic for metric boxes
  const displayTrips = activeTrips.filter(t => {
    if (activeTab === "all") return true;
    if (activeTab === "assigned") return t.status === "ASSIGNED";
    if (activeTab === "in-progress") return t.status === "IN PROGRESS";
    return true;
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-light text-4xl">local_taxi</span>
            Driver Dashboard
          </h2>
          <p className="mt-1 text-slate-300">View and manage your active trips</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 shadow-xl backdrop-blur-md">
          <div className="flex flex-col mr-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
            <span className={`text-sm font-bold ${isOnline ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <button
            onClick={toggleStatus}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark ${isOnline ? 'bg-emerald-500' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => setActiveTab("assigned")}
          className={`rounded-2xl border backdrop-blur-md p-6 shadow-xl relative overflow-hidden group transition-all cursor-pointer ${activeTab === 'assigned' ? 'bg-primary/20 border-primary shadow-primary/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <h3 className="text-slate-400 text-sm font-medium mb-2">Assigned Trips</h3>
          <div className="text-4xl font-bold text-white">{activeTrips.filter(t => t.status === "ASSIGNED").length}</div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all pointer-events-none"></div>
        </div>
        <div
          onClick={() => setActiveTab("in-progress")}
          className={`rounded-2xl border backdrop-blur-md p-6 shadow-xl relative overflow-hidden group transition-all cursor-pointer ${activeTab === 'in-progress' ? 'bg-amber-500/20 border-amber-500 shadow-amber-500/20 scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
        >
          <h3 className="text-slate-400 text-sm font-medium mb-2">In Progress</h3>
          <div className="text-4xl font-bold text-amber-400">
            {activeTrips.filter(t => t.status === "IN PROGRESS").length}
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl group-hover:bg-amber-500/30 transition-all pointer-events-none"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <button
          className={`py-1.5 px-4 rounded-lg font-medium text-sm transition-all bg-white/10 text-white shadow-sm border border-white/10`}
          onClick={() => setActiveTab("all")}
        >
          View All Active
        </button>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/20 text-xs uppercase text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Employee</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Route</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Time</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Vehicle</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayTrips.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No active trips found.</td></tr>
              ) : (
                displayTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-slate-500 font-mono">#{trip.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{trip.employeeName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="material-symbols-outlined text-[14px] text-emerald-400">my_location</span>
                          <span className="text-slate-200 truncate max-w-[150px]">{trip.pickup}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="material-symbols-outlined text-[14px] text-indigo-400">location_on</span>
                          <span className="text-slate-200 truncate max-w-[150px]">{trip.dropLocation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-200 font-medium">{trip.pickupTime}</span>
                        <span className="text-xs text-slate-400">{trip.bookingDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">directions_car</span>
                        {trip.cabType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border shadow-sm ${trip.status === "COMPLETED" ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30" :
                        trip.status === "CANCELLED" ? "bg-red-500/10 text-red-300 border-red-500/30" :
                          trip.status === "IN PROGRESS" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" :
                            "bg-blue-500/10 text-blue-300 border-blue-500/30"
                        }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trip.status === "ASSIGNED" && (
                        <button
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-primary/20 text-primary-light hover:bg-primary hover:text-white border border-primary/30 hover:border-primary rounded-lg transition-all"
                          onClick={() => handleStartTrip(trip.id)}
                        >
                          <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                          Start Trip
                        </button>
                      )}
                      {trip.status === "IN PROGRESS" && (
                        <button
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/30 hover:border-amber-500 rounded-lg transition-all shadow-lg shadow-amber-500/20"
                          onClick={() => handleCompleteTrip(trip.id)}
                        >
                          <span className="material-symbols-outlined text-[16px]">done_all</span>
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
