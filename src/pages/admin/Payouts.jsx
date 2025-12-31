import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiCheckCircle, FiSearch, FiFilter, FiUploadCloud } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Payouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [selectedPayout, setSelectedPayout] = useState(null);
    const [utr, setUtr] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const { data, error } = await supabase
                .from('payouts')
                .select(`
                    *,
                    investor_requests (
                        id,
                        plan_name,
                        account_holder_name,
                        account_number,
                        ifsc_code,
                        bank_name,
                        users (full_name, email)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            // Table might not exist or empty
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Payouts</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6">Amount</th>
                                <th className="py-4 px-6">UTR</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading...</td></tr>
                            ) : payouts.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No payouts found</td></tr>
                            ) : payouts.map(payout => (
                                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${payout.type === 'Profit' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                            {payout.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-900 font-mono font-medium">₹{payout.amount}</td>
                                    <td className="py-4 px-6 font-mono text-xs">{payout.transaction_utr || '-'}</td>
                                    <td className="py-4 px-6 text-gray-600">{payout.status}</td>
                                    <td className="py-4 px-6 text-sm">{new Date(payout.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payouts;
