import React, { useState } from "react";
import axios from "axios";

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
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8">
      {/* Page Title & Status */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Taxi Dispatch</h2>
        <p className="mt-1 text-slate-300">Schedule a ride for an employee</p>

        {message && (
          <div className={`mt-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'} flex items-center gap-3 font-medium`}>
            <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
            {message.text}
          </div>
        )}
      </div>

      <form onSubmit={handleBook} className="space-y-6">
        {/* Passenger Section */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 shadow-xl glass-panel relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl mix-blend-screen pointer-events-none"></div>

          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-light">person</span>
            Passenger Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Employee Name</label>
              <input
                type="text"
                name="employeeName"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Enter employee's full name"
                value={form.employeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number (For SMS)</label>
              <input
                type="tel"
                name="employeeMobileNumber"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="+1234567890"
                value={form.employeeMobileNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin Section */}
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 shadow-xl glass-panel relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">my_location</span>
                1. Origin
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pickup Location</label>
                  <input
                    type="text"
                    name="pickup"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Street, City, or Building"
                    value={form.pickup}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pickup Time</label>
                  <input
                    type="time"
                    name="pickupTime"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors [color-scheme:dark]"
                    value={form.pickupTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Destination/Details Section */}
          <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 shadow-xl glass-panel relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400">location_on</span>
                2. Destination & Details
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Drop Location</label>
                  <input
                    type="text"
                    name="dropLocation"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Street, City, or Building"
                    value={form.dropLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Type</label>
                  <div className="relative">
                    <select
                      name="cabType"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      value={form.cabType}
                      onChange={handleChange}
                    >
                      <option value="Cab" className="bg-slate-800">Standard Cab</option>
                      <option value="Van" className="bg-slate-800">Minivan (6+ seats)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Row */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-w-[200px]"
            disabled={loading}
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing...</>
            ) : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookCab;
