import React, { useState } from "react";
import axios from "axios";

const AddDriver = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    cabType: "Cab",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:8081/api/admin/add-driver", form, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });

      setMessage({ type: "success", text: res.data });
      setForm({ name: "", email: "", cabType: "Cab" });
    } catch (error) {
      console.error("Driver add failed", error);
      setMessage({ type: "error", text: "Failed to add driver" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Add New Driver</h2>
        <p className="mt-1 text-slate-300">Register a new driver into the fleet system</p>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 shadow-xl glass-panel relative overflow-hidden">
        {/* Decorative blur rings */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl mix-blend-screen pointer-events-none"></div>

        {message && (
          <div className={`mb - 6 p - 4 rounded - xl border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'} flex items - center gap - 3 font - medium`}>
            <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Driver Name</label>
            <input
              name="name"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Enter driver name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Driver Email</label>
            <input
              type="email"
              name="email"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="Enter driver email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="+1234567890"
              value={form.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Vehicle Type</label>
            <select
              name="cabType"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
              value={form.cabType}
              onChange={handleChange}
            >
              <option value="Cab" className="bg-slate-800">Standard Cab</option>
              <option value="Van" className="bg-slate-800">Minivan</option>
            </select>
          </div>

          <button type="submit" className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2" disabled={loading}>
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Processing...</>
            ) : "Register Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;
