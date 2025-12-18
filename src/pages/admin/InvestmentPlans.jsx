import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const InvestmentPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('investment_plans')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Investment Plans</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">
                    + Add Plan
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-white col-span-full text-center">Loading plans...</div>
                ) : plans.map(plan => (
                    <div key={plan.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 shadow flex flex-col relative">
                        {plan.is_active && <span className="absolute top-4 right-4 bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded">ACTIVE</span>}
                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="text-3xl font-bold text-blue-400 mb-4">{plan.roi_percentage}% <span className="text-sm text-gray-400 font-normal">ROI</span></div>
                        <div className="space-y-2 text-gray-300 mb-6 flex-1">
                            <p>Duration: <span className="text-white">{plan.duration_months} Months</span></p>
                            <p>Min: <span className="text-white">₹{plan.min_amount}</span></p>
                            <p>Max: <span className="text-white">₹{plan.max_amount}</span></p>
                        </div>
                        <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition">Edit Plan</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestmentPlans;
