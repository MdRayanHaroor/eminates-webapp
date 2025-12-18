import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiActivity, FiClock } from 'react-icons/fi';

const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all shadow-lg shadow-black/20 group"
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingRequests: 0,
        totalInvested: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Users (Users table)
                const { count: userCount, error: userError } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true }); // Head=true for count only

                // 2. Pending Requests
                const { count: pendingCount, error: pendingError } = await supabase
                    .from('investor_requests')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pending');

                // 3. Total Investment Volume (Approved/Active)
                // Note: .sum() isn't direct in generic Supabase client without RPC, but we can fetch and reduce or use an RPC if available.
                // For now, let's fetch active requests and sum client-side (assuming reasonable dataset size, otherwise RPC is better)
                const { data: investments, error: investError } = await supabase
                    .from('investor_requests')
                    .select('investment_amount')
                    .or('status.eq.approved,status.eq.active');

                const totalVol = investments?.reduce((acc, curr) => {
                    const amount = parseFloat(curr.investment_amount) || 0;
                    return acc + amount;
                }, 0) || 0;

                // 4. Recent Activity
                const { data: activity, error: activityError } = await supabase
                    .from('investor_requests')
                    .select('id, full_name, plan_name, investment_amount, status, created_at')
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (userError || pendingError || investError || activityError) {
                    console.error("Error fetching stats:", userError, pendingError, investError, activityError);
                }

                setStats({
                    totalUsers: userCount || 0,
                    pendingRequests: pendingCount || 0,
                    totalInvested: totalVol,
                    recentActivity: activity || []
                });

            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return <div className="text-white">Loading dashboard data...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-slate-400">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="text-sm bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-700">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<FiUsers size={24} />}
                    color="bg-blue-500"
                    delay={0}
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    icon={<FiClock size={24} />}
                    color="bg-yellow-500"
                    delay={0.1}
                />
                <StatCard
                    title="Total Investment"
                    value={formatCurrency(stats.totalInvested)}
                    icon={<FiDollarSign size={24} />}
                    color="bg-green-500"
                    delay={0.2}
                />
            </div>

            {/* Recent Activity Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20"
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FiActivity className="text-blue-400" />
                        Recent Investment Activity
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 uppercase text-xs font-semibold tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{item.full_name || 'N/A'}</td>
                                        <td className="px-6 py-4">{item.plan_name}</td>
                                        <td className="px-6 py-4 text-white font-mono">{formatCurrency(item.investment_amount)}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${item.status === 'approved' || item.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    item.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No recent activity found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
