import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageHRs = () => {
    const [hrs, setHrs] = useState([]);
    const [filter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modals state
    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState({ username: "", email: "", password: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [currentHR, setCurrentHR] = useState(null);
    const [editForm, setEditForm] = useState({ username: "", email: "", password: "" });
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetchHRs();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const fetchHRs = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get("http://localhost:8081/api/admin/hrs", {
                headers: { Authorization: "Bearer " + token },
            });
            setHrs(response.data);
        } catch (error) {
            console.error("Failed to fetch HRs", error);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:8081/api/admin/add-hr", addForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setModalMessage({ type: "success", text: "HR added successfully!" });
            fetchHRs();
            setTimeout(() => { setIsAdding(false); setModalMessage(""); }, 1500);
        } catch (error) {
            setModalMessage({ type: "error", text: error.response?.data || "Failed to add HR" });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:8081/api/admin/edit-hr/${currentHR.id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setModalMessage({ type: "success", text: "HR updated successfully!" });
            fetchHRs();
            setTimeout(() => { setIsEditing(false); setModalMessage(""); }, 1500);
        } catch (error) {
            setModalMessage({ type: "error", text: "Failed to update HR" });
        }
    };

    const handleDeleteHR = async (id) => {
        if (!window.confirm("Are you sure you want to delete this HR account?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8081/api/admin/delete-hr/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHRs();
            setIsEditing(false); // Close modal on delete
        } catch (error) {
            alert("Failed to delete HR");
        }
    };

    const openEditModal = (hr) => {
        setCurrentHR(hr);
        setEditForm({ username: hr.username || hr.name || "", email: hr.email, password: "" });
        setModalMessage("");
        setIsEditing(true);
    };

    const filteredHRs = hrs;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHRs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredHRs.length / itemsPerPage);

    return (
        <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Manage HR Accounts</h2>
                    <p className="mt-1 text-slate-300">View and manage Human Resource personnel</p>
                </div>
                <button
                    onClick={() => { setAddForm({ username: '', email: '', password: '' }); setModalMessage(""); setIsAdding(true); }}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl shadow-lg flex items-center gap-2 transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">person_add</span> Add HR
                </button>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-hidden glass-panel">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-black/20 text-xs uppercase text-slate-400 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">ID</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Email</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentItems.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-400">No HRs registered</td></tr>
                            ) : (
                                currentItems.map((h) => (
                                    <tr key={h.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 font-mono">#{h.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{h.username || h.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-300">{h.email}</td>
                                        <td className="px-6 py-4 text-slate-300">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 uppercase text-xs font-bold tracking-wider">
                                                <span className="material-symbols-outlined text-[14px] text-slate-400">work</span>
                                                {h.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                                ✅ Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => openEditModal(h)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 text-sm">
                                                <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
                        <span className="text-sm text-slate-400">
                            Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredHRs.length)}</span> of <span className="text-white font-medium">{filteredHRs.length}</span> entries
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">Previous</button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add HR Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-[#1e293b] border border-white/10 shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="text-lg font-bold text-white m-0">Add New HR</h3>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6">
                            {modalMessage && (
                                <div className={`mb-4 p-3 rounded-lg border ${modalMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'} flex items-center gap-2 text-sm font-medium`}>
                                    <span className="material-symbols-outlined text-[18px]">{modalMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                                    {modalMessage.text}
                                </div>
                            )}
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label><input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white" value={addForm.username} onChange={(e) => setAddForm({ ...addForm, username: e.target.value })} required /></div>
                                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label><input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} required /></div>
                                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label><input type="password" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} required /></div>
                                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-xl shadow-lg mt-4">Create HR Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit HR Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-[#1e293b] border border-white/10 shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="text-lg font-bold text-white m-0">Edit HR: <span className="text-primary-light font-medium">{currentHR?.username}</span></h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6">
                            {modalMessage && (
                                <div className={`mb-4 p-3 rounded-lg border ${modalMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'} flex items-center gap-2 text-sm font-medium`}>
                                    <span className="material-symbols-outlined text-[18px]">{modalMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                                    {modalMessage.text}
                                </div>
                            )}
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label><input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} required /></div>
                                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label><input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required /></div>
                                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">New Password (Optional)</label><input type="password" placeholder="Leave blank to keep current" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} /></div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => handleDeleteHR(currentHR.id)} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium py-2.5 rounded-xl transition-colors border border-red-500/10 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">delete</span> Delete
                                    </button>
                                    <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
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

export default ManageHRs;
