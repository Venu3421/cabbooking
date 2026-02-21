function ItDashboard() {
  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-6 pt-10">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">Welcome, IT Department!</h2>
        <p className="mt-3 text-lg text-slate-300">System metrics and configuration will appear here.</p>
      </div>

      <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md p-12 shadow-xl relative overflow-hidden flex flex-col items-center justify-center text-center glass-panel">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl mix-blend-screen pointer-events-none"></div>
        <span className="material-symbols-outlined text-indigo-400 text-6xl mb-4 relative z-10">admin_panel_settings</span>
        <h3 className="text-xl font-bold text-white mb-2 relative z-10">IT Control Center</h3>
        <p className="text-slate-400 relative z-10">Coming soon.</p>
      </div>
    </div>
  );
}

export default ItDashboard;
