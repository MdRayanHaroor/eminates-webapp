import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiActivity, FiClock, FiBriefcase } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, colorClass, delay, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        onClick={onClick}
        className={`bg-white border border-gray-200 p-6 rounded-xl hover:border-gray-300 transition-all shadow-sm group ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
            <div className={`p-3 rounded-lg ${colorClass} group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    // ... (stats state and useEffect remain unchanged) ...
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAgents: 0,
        pendingRequests: 0,
        totalInvested: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // 1. Total Users (Users table - role 'user')
                // Note: role might be 'authenticated' if using Supabase auth directly, or 'user' if using custom role column. 
                // Based on UserDetails code, there is a 'role' column. User requested 'users'. 
                // Trying case insensitive search for safety or standard string.
                const { count: userCount, error: userError } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .or('role.eq.user,role.eq.users');

                // 1b. Total Agents
                const { count: agentCount, error: agentError } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'agent');

                // 2. Pending Requests (Fix: Check for 'Pending' Title Case as well)
                const { count: pendingCount, error: pendingError } = await supabase
                    .from('investor_requests')
                    .select('*', { count: 'exact', head: true })
                    .ilike('status', 'pending');

                // 3. Total Investment Volume (Approved/Active)
                const { data: investments, error: investError } = await supabase
                    .from('investor_requests')
                    .select('investment_amount')
                    .eq('status', 'Investment Confirmed');

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

                if (userError || agentError || pendingError || investError || activityError) {
                    console.error("Error fetching stats:", userError, agentError, pendingError, investError, activityError);
                }

                setStats({
                    totalUsers: userCount || 0,
                    totalAgents: agentCount || 0,
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
        return <div className="text-gray-600 p-8">Loading dashboard data...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
                </div>
                <div className="text-sm bg-white text-gray-600 px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<FiUsers size={24} />}
                    colorClass="bg-blue-50 text-blue-600"
                    delay={0}
                    onClick={() => navigate('/admin/users')}
                />
                <StatCard
                    title="Total Agents"
                    value={stats.totalAgents}
                    icon={<FiBriefcase size={24} />}
                    colorClass="bg-purple-50 text-purple-600"
                    delay={0.1}
                    onClick={() => navigate('/admin/users', { state: { roleFilter: 'agent' } })}
                />
                <StatCard
                    title="Pending Requests"
                    value={stats.pendingRequests}
                    icon={<FiClock size={24} />}
                    colorClass="bg-yellow-50 text-yellow-600"
                    delay={0.2}
                    onClick={() => navigate('/admin/requests', { state: { activeTab: 'pending' } })}
                />
                <StatCard
                    title="Total Investment"
                    value={formatCurrency(stats.totalInvested)}
                    icon={<FiDollarSign size={24} />}
                    colorClass="bg-green-50 text-green-600"
                    delay={0.3}
                    onClick={() => navigate('/admin/requests', { state: { activeTab: 'active' } })}
                />
            </div>

            {/* Recent Activity Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiActivity className="text-blue-600" />
                        Recent Investment Activity
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 uppercase text-xs font-semibold tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.full_name || 'N/A'}</td>
                                        <td className="px-6 py-4">{item.plan_name}</td>
                                        <td className="px-6 py-4 text-green-600 font-mono font-medium">{formatCurrency(item.investment_amount)}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                                                ${item.status === 'approved' || item.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' :
                                                    item.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                        'bg-red-50 text-red-600 border-red-200'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
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
