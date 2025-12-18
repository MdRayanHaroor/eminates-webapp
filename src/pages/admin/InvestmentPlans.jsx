import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiBriefcase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const InvestmentPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        roi_percentage: '',
        monthly_profit_percentage: '',
        quarterly_profit_percentage: '',
        duration_months: '',
        min_amount: '',
        max_amount: '',
        description: '',
        features: '', // Textarea (split by newline)
        is_active: true
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('investment_plans')
                .select('*')
                .order('min_amount', { ascending: true }); // Order by amount makes sense

            if (error) throw error;
            setPlans(data || []);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                roi_percentage: plan.roi_percentage,
                monthly_profit_percentage: plan.monthly_profit_percentage || '',
                quarterly_profit_percentage: plan.quarterly_profit_percentage || '',
                duration_months: plan.duration_months,
                min_amount: plan.min_amount,
                max_amount: plan.max_amount,
                description: plan.description || '',
                features: plan.features ? plan.features.join('\n') : '',
                is_active: plan.is_active
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                roi_percentage: '',
                monthly_profit_percentage: '',
                quarterly_profit_percentage: '',
                duration_months: '',
                min_amount: '',
                max_amount: '',
                description: '',
                features: '',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                features: formData.features.split('\n').filter(f => f.trim() !== '') // Convert to array
            };

            if (editingPlan) {
                const { error } = await supabase
                    .from('investment_plans')
                    .update(payload)
                    .eq('id', editingPlan.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('investment_plans')
                    .insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchPlans();
        } catch (error) {
            console.error("Error saving plan:", error);
            alert("Failed to save plan.");
        }
    };

    const handleToggleActive = async (plan) => {
        try {
            const { error } = await supabase
                .from('investment_plans')
                .update({ is_active: !plan.is_active })
                .eq('id', plan.id);

            if (error) throw error;
            // Optimistic update
            setPlans(plans.map(p => p.id === plan.id ? { ...p, is_active: !p.is_active } : p));
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Investment Plans</h1>
                    <p className="text-slate-400 mt-1">Manage investment packages available to users.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                    <FiPlus /> Add Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-slate-500 col-span-full text-center py-10">Loading plans...</div>
                ) : plans.map(plan => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={plan.id}
                        className={`bg-slate-900 rounded-xl p-6 border relative transition-all group hover:shadow-xl hover:-translate-y-1
                            ${plan.is_active ? 'border-slate-800 hover:border-blue-500/50' : 'border-red-900/30 opacity-75'}`}
                    >
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => handleToggleActive(plan)}
                                className={`p-1.5 rounded-full text-xs font-bold transition-colors
                                    ${plan.is_active ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                title={plan.is_active ? "Deactivate" : "Activate"}
                            >
                                {plan.is_active ? <FiCheck /> : <FiX />}
                            </button>
                            <button
                                onClick={() => handleOpenModal(plan)}
                                className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
                            >
                                <FiEdit />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 mb-3">
                                <FiBriefcase size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white truncate pr-16">{plan.name}</h3>
                            <p className="text-slate-500 text-sm h-10 overflow-hidden text-ellipsis">{plan.description || 'No description'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-950/50 rounded-lg">
                            <div>
                                <div className="text-slate-500 text-xs uppercase">ROI</div>
                                <div className="text-blue-400 font-bold text-lg">{plan.roi_percentage}%</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase">Duration</div>
                                <div className="text-white font-bold text-lg">{plan.duration_months} mo</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase">Profit (M)</div>
                                <div className="text-green-400 font-medium">{plan.monthly_profit_percentage ? `${plan.monthly_profit_percentage}%` : '-'}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase">Profit (Q)</div>
                                <div className="text-green-400 font-medium">{plan.quarterly_profit_percentage ? `${plan.quarterly_profit_percentage}%` : '-'}</div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-400 border-t border-slate-800 pt-4">
                            <div className="flex justify-between">
                                <span>Min Investment:</span>
                                <span className="text-white font-mono">₹{plan.min_amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Max Investment:</span>
                                <span className="text-white font-mono">₹{plan.max_amount}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingPlan ? 'Edit Investment Plan' : 'Create New Plan'}
                            </h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-slate-400 text-sm mb-1">Plan Name</label>
                                        <input required type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Total ROI (%)</label>
                                        <input required type="number" step="0.1" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.roi_percentage} onChange={e => setFormData({ ...formData, roi_percentage: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Duration (Months)</label>
                                        <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.duration_months} onChange={e => setFormData({ ...formData, duration_months: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Monthly Profit (%)</label>
                                        <input type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.monthly_profit_percentage} onChange={e => setFormData({ ...formData, monthly_profit_percentage: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Quarterly Profit (%)</label>
                                        <input type="number" step="0.01" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.quarterly_profit_percentage} onChange={e => setFormData({ ...formData, quarterly_profit_percentage: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Min Amount (₹)</label>
                                        <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.min_amount} onChange={e => setFormData({ ...formData, min_amount: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Max Amount (₹)</label>
                                        <input required type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.max_amount} onChange={e => setFormData({ ...formData, max_amount: e.target.value })} />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-slate-400 text-sm mb-1">Description</label>
                                        <textarea className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="2" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-slate-400 text-sm mb-1">Features (One per line)</label>
                                        <textarea className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                            placeholder="Capital Protection&#10;Instant Withdrawal&#10;24/7 Support"
                                            value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} rows="4" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">Cancel</button>
                                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-lg shadow-blue-600/20">Save Plan</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvestmentPlans;
