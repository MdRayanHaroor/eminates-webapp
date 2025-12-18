import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const InvestmentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            // Fetch requests joined with user details if possible, or just raw
            const { data, error } = await supabase
                .from('investor_requests')
                .select(`*, users (full_name, email)`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-500 border-green-500/50 bg-green-500/10';
            case 'Rejected': return 'text-red-500 border-red-500/50 bg-red-500/10';
            case 'Pending': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
            case 'Investment Confirmed': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
            default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Investment Requests</h1>
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Plan</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">UTR</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">No requests found</td></tr>
                            ) : requests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="text-white font-medium">{req.users?.full_name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{req.users?.email}</div>
                                    </td>
                                    <td className="py-3 px-4 text-white">{req.plan_name}</td>
                                    <td className="py-3 px-4 text-green-400 font-mono">₹{req.investment_amount}</td>
                                    <td className="py-3 px-4 font-mono text-sm">{req.transaction_utr || '-'}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvestmentRequests;
