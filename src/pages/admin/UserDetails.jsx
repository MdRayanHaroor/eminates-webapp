import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FiArrowLeft, FiUser, FiCreditCard, FiActivity, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            // 1. Fetch User Profile
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError) throw userError;

            // 2. Fetch User Investments
            const { data: invData, error: invError } = await supabase
                .from('investor_requests')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (invError) console.error("Error fetching investments:", invError);

            setUser(userData);
            setInvestments(invData || []);
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white p-8">Loading profile...</div>;
    if (!user) return <div className="text-white p-8">User not found</div>;

    // Extract bank details from latest investment or return null
    const latestInvestment = investments.length > 0 ? investments[0] : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                    <FiArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">{user.full_name || 'Unknown User'}</h1>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize
                        ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            user.role === 'agent' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {user.role}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-700 flex gap-6">
                {['overview', 'investments', 'bank_details'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium capitalize transition-colors relative
                            ${activeTab === tab ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    >
                        {tab.replace('_', ' ')}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FiUser className="text-blue-400" /> Personal Info
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-slate-500 block">Full Name</label>
                                        <p className="text-slate-200">{user.full_name || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-slate-500 block">Phone</label>
                                        <p className="text-slate-200">{user.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-slate-500 block">Joined Date</label>
                                        <p className="text-slate-200">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-slate-500 block">User ID</label>
                                        <p className="text-slate-200 font-mono text-xs">{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Summary */}
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FiActivity className="text-green-400" /> Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-lg">
                                    <div className="text-slate-400 text-xs uppercase">Total Requests</div>
                                    <div className="text-2xl font-bold text-white mt-1">{investments.length}</div>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg">
                                    <div className="text-slate-400 text-xs uppercase">Last Active</div>
                                    <div className="text-sm font-medium text-white mt-2">
                                        {latestInvestment ? new Date(latestInvestment.created_at).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'investments' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {investments.length === 0 ? (
                            <p className="text-slate-500">No investment history found.</p>
                        ) : (
                            investments.map((inv) => (
                                <div key={inv.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition-colors">
                                    <div>
                                        <h4 className="text-white font-medium">{inv.plan_name}</h4>
                                        <p className="text-slate-400 text-sm">Amount: ₹{inv.investment_amount}</p>
                                        <p className="text-slate-500 text-xs">Date: {new Date(inv.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                                            ${inv.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                inv.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    'bg-red-500/10 text-red-400'}`}>
                                            {inv.status}
                                        </span>
                                        {inv.aadhaar_card_url && (
                                            <a href={inv.aadhaar_card_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                                                <FiDownload size={14} /> Docs
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'bank_details' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 max-w-2xl">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <FiCreditCard className="text-purple-400" /> Bank Information
                            </h3>
                            {latestInvestment ? (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-slate-500 block mb-1">Account Holder</label>
                                            <div className="font-medium text-white p-2 bg-slate-800 rounded">{latestInvestment.account_holder_name}</div>
                                        </div>
                                        <div>
                                            <label className="text-slate-500 block mb-1">Bank Name</label>
                                            <div className="font-medium text-white p-2 bg-slate-800 rounded">{latestInvestment.bank_name}</div>
                                        </div>
                                        <div>
                                            <label className="text-slate-500 block mb-1">Account Number</label>
                                            <div className="font-medium text-white p-2 bg-slate-800 rounded font-mono">{latestInvestment.account_number}</div>
                                        </div>
                                        <div>
                                            <label className="text-slate-500 block mb-1">IFSC Code</label>
                                            <div className="font-medium text-white p-2 bg-slate-800 rounded font-mono">{latestInvestment.ifsc_code}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-4 italic">
                                        * Details sourced from most recent investment request (ID: {latestInvestment.id.slice(0, 8)}).
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-500">No bank details found (User has not made any investment requests yet).</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
