import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [editForm, setEditForm] = useState({ mobileNumber: "", name: "", cabType: "" });
  const [editMessage, setEditMessage] = useState("");

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get("http://localhost:8081/api/admin/view-drivers", {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      setDrivers(response.data);
    } catch (error) {
      console.error("Failed to fetch drivers", error);
    }
  };

  const handleEditClick = (driver) => {
    setCurrentDriver(driver);
    setEditForm({
      mobileNumber: driver.mobileNumber || "",
      name: driver.name || "",
      cabType: driver.cabType || "Cab"
    });
    setEditMessage("");
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`http://localhost:8081/api/admin/edit-driver/${currentDriver.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditMessage({ type: "success", text: "Driver updated successfully!" });
      fetchDrivers(); // Refresh list
      setTimeout(() => setIsEditing(false), 1500); // Close modal after short delay
    } catch (error) {
      console.error("Failed to update driver", error);
      setEditMessage({ type: "error", text: "Failed to update driver." });
    }
  };

  const handleDeleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/admin/delete-driver/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDrivers();
      setIsEditing(false); // Close modal on delete
    } catch (error) {
      console.error("Failed to delete driver", error);
      alert("Failed to delete driver.");
    }
  };

  const filteredDrivers = drivers.filter(d => {
    if (filter === 'AVAILABLE') return d.available;
    if (filter === 'UNAVAILABLE') return !d.available;
    return true;
  });

  // Pagination Logic 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">All Registered Drivers</h2>
        <p className="mt-1 text-slate-300">Manage fleet personnel and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setFilter('ALL')}
          className={`rounded-2xl border backdrop-blur-md p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-all cursor-pointer ${filter === 'ALL' ? 'bg-white/15 border-white/30 scale-105' : 'bg-white/5 border-white/10'}`}>
          <h3 className="text-slate-400 text-sm font-medium mb-2">Total Drivers</h3>
          <div className="text-4xl font-bold text-white">{drivers.length}</div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all pointer-events-none"></div>
        </div>
        <div
          onClick={() => setFilter('AVAILABLE')}
          className={`rounded-2xl border backdrop-blur-md p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-all cursor-pointer ${filter === 'AVAILABLE' ? 'bg-white/15 border-emerald-500/30 scale-105' : 'bg-white/5 border-white/10'}`}>
          <h3 className="text-slate-400 text-sm font-medium mb-2">Available</h3>
          <div className="text-4xl font-bold text-emerald-400">
            {drivers.filter(d => d.available).length}
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl group-hover:bg-emerald-500/30 transition-all pointer-events-none"></div>
        </div>
        <div
          onClick={() => setFilter('UNAVAILABLE')}
          className={`rounded-2xl border backdrop-blur-md p-6 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-all cursor-pointer ${filter === 'UNAVAILABLE' ? 'bg-white/15 border-red-500/30 scale-105' : 'bg-white/5 border-white/10'}`}>
          <h3 className="text-slate-400 text-sm font-medium mb-2">Unavailable</h3>
          <div className="text-4xl font-bold text-red-400">
            {drivers.filter(d => !d.available).length}
          </div>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-500/20 blur-2xl group-hover:bg-red-500/30 transition-all pointer-events-none"></div>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black/20 text-xs uppercase text-slate-400 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Mobile Number</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Vehicle Type</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">No drivers match this filter</td></tr>
              ) : (
                currentItems.map((d) => (
                  <tr key={d.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono">#{d.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{d.name}</td>
                    <td className="px-6 py-4 text-slate-300">{d.email}</td>
                    <td className="px-6 py-4">{d.mobileNumber || <span className="text-red-400 text-xs px-2 py-1 rounded bg-red-500/10 border border-red-500/20">Missing</span>}</td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                        <span className="material-symbols-outlined text-[14px] text-slate-400">directions_car</span>
                        {d.cabType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {d.available ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          ✅ Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/30">
                          ⛔ Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditClick(d)}
                        className="flex w-fit items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 text-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                      </button>
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
              Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredDrivers.length)}</span> of <span className="text-white font-medium">{filteredDrivers.length}</span> entries
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

      {/* Edit Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1e293b] border border-white/10 shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h3 className="text-lg font-bold text-white m-0">Edit Driver: <span className="text-primary-light font-medium">{currentDriver?.name}</span></h3>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }}
                className="text-slate-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 cursor-pointer relative z-[110]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              {editMessage && (
                <div className={`mb-4 p-3 rounded-lg border ${editMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'} flex items-center gap-2 text-sm font-medium`}>
                  <span className="material-symbols-outlined text-[18px]">{editMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                  {editMessage.text}
                </div>
              )}

              <form onSubmit={submitEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Mobile Number (SMS)</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                    placeholder="+1234567890"
                    value={editForm.mobileNumber}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Vehicle Type</label>
                  <select
                    name="cabType"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm cursor-pointer"
                    value={editForm.cabType}
                    onChange={handleEditChange}
                  >
                    <option value="Cab" className="bg-slate-800">Standard Cab</option>
                    <option value="Van" className="bg-slate-800">Minivan</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => handleDeleteDriver(currentDriver.id)} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-2.5 px-4 rounded-xl transition-colors border border-red-500/10 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                  </button>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">save</span> Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ViewDrivers;
