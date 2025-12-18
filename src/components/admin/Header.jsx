import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiUser } from 'react-icons/fi';

const Header = () => {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email);
        };
        getUser();
    }, []);

    return (
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40">
            <div className="text-gray-400 text-sm">
                Dashboard &gt; <span className="text-white">Overview</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <FiUser />
                    </div>
                    <span className="text-sm text-gray-300 hidden md:block">
                        {userEmail || 'Admin'}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
