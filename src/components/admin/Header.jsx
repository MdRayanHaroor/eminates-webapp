import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiUser } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const [userEmail, setUserEmail] = useState('');
    const location = useLocation();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email);
        };
        getUser();
    }, []);

    const getBreadcrumb = () => {
        const path = location.pathname;

        if (path.includes('/admin/requests')) return <>Investment <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Requests</span></>;
        if (path.includes('/admin/plans')) return <>Investment <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Plans</span></>;
        if (path.includes('/admin/users')) {
            // Check if it's a detail page (has ID)
            const parts = path.split('/');
            if (parts.length > 3) return <>User Management <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">User Details</span></>;
            return <>User Management <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">All Users</span></>;
        }
        if (path.includes('/admin/payouts')) return <>Finance <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Payouts</span></>;
        if (path.includes('/admin/notifications')) return <>System <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Notifications</span></>;
        if (path.includes('/admin/settings')) return <>System <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Settings</span></>;

        // Default
        return <>Dashboard <span className="mx-2">&gt;</span> <span className="text-gray-900 font-medium">Overview</span></>;
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40 shadow-sm transition-all duration-300">
            <div className="text-gray-500 text-sm flex items-center">
                {getBreadcrumb()}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow transition-shadow">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                        <FiUser />
                    </div>
                    <span className="text-sm text-gray-700 hidden md:block font-medium">
                        {userEmail || 'Admin'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
