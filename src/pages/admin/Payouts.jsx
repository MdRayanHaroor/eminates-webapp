import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const Payouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const { data, error } = await supabase
                .from('payouts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayouts(data);
        } catch (error) {
            // Table might not exist or empty
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Payouts</h1>
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">UTR</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                            ) : payouts.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4">No payouts found</td></tr>
                            ) : payouts.map(payout => (
                                <tr key={payout.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${payout.type === 'Profit' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                            {payout.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-white font-mono">₹{payout.amount}</td>
                                    <td className="py-3 px-4 font-mono text-sm">{payout.transaction_utr || '-'}</td>
                                    <td className="py-3 px-4 text-white">{payout.status}</td>
                                    <td className="py-3 px-4 text-sm">{new Date(payout.created_at).toLocaleDateString()}</td>
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
