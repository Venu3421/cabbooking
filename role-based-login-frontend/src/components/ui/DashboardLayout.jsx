import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavBar } from './tubelight-navbar';
import { LayoutDashboard, UserPlus, Users, CarFront, List } from 'lucide-react';
import GlobalClockWeather from './GlobalClockWeather';

// Role-based navigation maps
const navItemsMap = {
    admin: [
        { name: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
        { name: "Manage HRs", url: "/admin/manage-hrs", icon: Users },
        { name: "Add Driver", url: "/admin/add-driver", icon: UserPlus },
        { name: "View Drivers", url: "/admin/view-drivers", icon: CarFront },
    ],
    hr: [
        { name: "Dashboard", url: "/hr-dashboard", icon: LayoutDashboard },
        { name: "Book Cab", url: "/hr/book-cab", icon: CarFront },
        { name: "My Bookings", url: "/hr/my-bookings", icon: List },
    ],
    driver: [
        { name: "Dashboard", url: "/driver-dashboard", icon: LayoutDashboard },
        { name: "My Rides", url: "/driver/my-rides", icon: List },
    ],
    it: [
        { name: "Dashboard", url: "/it-dashboard", icon: LayoutDashboard },
    ]
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [navItems, setNavItems] = useState([]);
    const [roleTitle, setRoleTitle] = useState("");

    useEffect(() => {
        // Authenticate and set user context
        const token = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');

        if (!token) {
            navigate('/');
            return;
        }

        setEmail(storedEmail || 'A');

        // Determine current role based on active path
        const path = location.pathname;

        if (path.includes('admin')) {
            setNavItems(navItemsMap.admin);
            setRoleTitle("Admin");
        } else if (path.includes('hr')) {
            setNavItems(navItemsMap.hr);
            setRoleTitle("HR");
        } else if (path.includes('driver')) {
            setNavItems(navItemsMap.driver);
            setRoleTitle("Driver");
        } else if (path.includes('it')) {
            setNavItems(navItemsMap.it);
            setRoleTitle("IT");
        }
    }, [location.pathname, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="bg-background-dark min-h-screen text-slate-100 font-display selection:bg-primary selection:text-white flex flex-col relative w-full overflow-x-hidden">
            {/* Background Gradients from Login page for visual continuity */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 blur-[120px] rounded-full mix-blend-screen animate-blob"></div>
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-background-dark/95 via-background-dark/80 to-primary/30 backdrop-blur-[2px]"></div>
            </div>

            {/* Tubelight Global Navbar */}
            {navItems.length > 0 && <NavBar items={navItems} className="z-50" />}

            {/* Global Header (Branding + Profile) */}
            <header className="relative z-40 w-full px-4 lg:px-8 py-4 flex items-center justify-between pointer-events-auto">
                {/* CabConnect Brand identically styled to login */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 border border-primary-light/20">
                        <span className="material-symbols-outlined text-xl">local_taxi</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight">
                            CabConnect
                        </h1>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-primary-light/80 mt-0.5">
                            {roleTitle} Dashboard
                        </span>
                    </div>
                </div>

                {/* Center / Right side (Clock + Profile) */}
                <div className="flex items-center gap-4">
                    <GlobalClockWeather />

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase shadow-lg shadow-primary/30 transition-all border border-primary-light/30"
                        >
                            {email ? email.charAt(0) : 'U'}
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-white/10">
                                    <p className="text-sm font-semibold text-white">{roleTitle} User</p>
                                    <p className="text-xs text-slate-400 truncate">{email}</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left cursor-pointer border-none bg-transparent">
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Page Content rendered by React Router Outlet */}
            <main className="flex-1 relative z-10 w-full px-4 lg:px-8 pb-24 pt-4">
                <div className="mx-auto max-w-7xl">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
