import React, { useEffect, useState } from "react";
import axios from "axios";

const MyRides = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetchMyTrips();
    }, []);

    const fetchMyTrips = async () => {
        const token = localStorage.getItem("token");
        const driverEmail = localStorage.getItem("email");

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

    const historyTrips = trips.filter(t => t.status === "COMPLETED" || t.status === "CANCELLED");

    return (
        <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6 pt-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400 text-4xl">history</span>
                    My Rides
                </h2>
                <p className="mt-1 text-slate-300">View your completed and cancelled trips history</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Total Historic Trips</h3>
                    <div className="text-4xl font-bold text-white">{historyTrips.length}</div>
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/30 transition-all pointer-events-none"></div>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Completed Trips</h3>
                    <div className="text-4xl font-bold text-emerald-400">
                        {historyTrips.filter(t => t.status === "COMPLETED").length}
                    </div>
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl group-hover:bg-emerald-500/30 transition-all pointer-events-none"></div>
                </div>
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {historyTrips.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No trips found in history.</td></tr>
                            ) : (
                                historyTrips.map((trip) => (
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
                                            {trip.status === "COMPLETED" ? (
                                                <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                                                    <span className="material-symbols-outlined text-[14px] font-bold">check_circle</span>
                                                    {trip.status}
                                                </div>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border shadow-sm ${trip.status === "CANCELLED" ? "bg-red-500/10 text-red-300 border-red-500/30" :
                                                        "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                                                    }`}>
                                                    {trip.status}
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
        </div>
    );
};

export default MyRides;
