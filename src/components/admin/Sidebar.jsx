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
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
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
                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <FiLogOut />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
