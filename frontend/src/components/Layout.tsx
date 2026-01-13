import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings as SettingsIcon, LogOut, BarChart3, CloudRainWind } from "lucide-react";
import { motion } from "framer-motion";

export const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("password");
        navigate("/login");
    };

    const navItems = [
        { path: "/", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/analytics", icon: BarChart3, label: "Analytics" },
        { path: "/settings", icon: SettingsIcon, label: "Settings" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform md:translate-x-0">
                <div className="flex h-full flex-col px-3 py-4">
                    <div className="mb-10 flex items-center gap-2 px-3">
                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                         </div>
                        <span className="text-xl font-bold text-gray-900">Q-Home</span>
                    </div>

                    <ul className="space-y-2 font-medium">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center rounded-lg p-3 group ${
                                            isActive
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-900 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0 transition duration-75" />
                                    <span className="ml-3">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center rounded-lg p-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                            <span className="ml-3">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                <main className="p-4 md:p-8">
                     <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
