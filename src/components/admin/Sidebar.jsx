import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiBell,
    FiDollarSign,
    FiBriefcase,
    FiSettings,
    FiLogOut
} from 'react-icons/fi';
import { supabase } from '../../lib/supabaseClient';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users' },
        { path: '/admin/requests', icon: <FiDollarSign />, label: 'Inv. Requests' },
        { path: '/admin/plans', icon: <FiBriefcase />, label: 'Inv. Plans' },
        { path: '/admin/payouts', icon: <FiDollarSign />, label: 'Payouts' },
        { path: '/admin/notifications', icon: <FiBell />, label: 'Notifications' }, // Added Notifications
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/admin/login';
    };

    return (
        <aside className="w-64 h-screen bg-slate-900 border-r border-slate-700 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-700">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    Admin Portal
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium text-sm">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <FiLogOut />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
