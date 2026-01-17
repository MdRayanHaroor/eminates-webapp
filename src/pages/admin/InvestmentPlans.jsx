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
        is_active: true,
        maturity_bonus: [] // Array of { year: '', percentage: '' }
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
            // Parse maturity_bonus JSON to array for form
            let bonusArray = [];
            if (plan.maturity_bonus) {
                try {
                    bonusArray = Object.entries(plan.maturity_bonus).map(([year, percentage]) => ({
                        year,
                        percentage
                    }));
                } catch (e) {
                    console.error("Error parsing maturity bonus", e);
                }
            }

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
                is_active: plan.is_active,
                maturity_bonus: bonusArray
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
                is_active: true,
                maturity_bonus: []
            });
        }
        setIsModalOpen(true);
    };

    // Helper to manage bonus fields
    const addBonusTier = () => {
        setFormData(prev => ({
            ...prev,
            maturity_bonus: [...prev.maturity_bonus, { year: '', percentage: '' }]
        }));
    };

    const removeBonusTier = (index) => {
        setFormData(prev => ({
            ...prev,
            maturity_bonus: prev.maturity_bonus.filter((_, i) => i !== index)
        }));
    };

    const updateBonusTier = (index, field, value) => {
        const newBonus = [...formData.maturity_bonus];
        newBonus[index][field] = value;
        setFormData({ ...formData, maturity_bonus: newBonus });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Convert bonus array back to object: { "3": 30, "5": 50 }
            const bonusObject = {};
            formData.maturity_bonus.forEach(item => {
                if (item.year && item.percentage) {
                    bonusObject[item.year] = Number(item.percentage);
                }
            });

            const payload = {
                ...formData,
                features: formData.features.split('\n').filter(f => f.trim() !== ''), // Convert to array
                maturity_bonus: bonusObject
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
                    <h1 className="text-3xl font-bold text-gray-900">Investment Plans</h1>
                    <p className="text-gray-500 mt-1">Manage investment packages available to users.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm"
                >
                    <FiPlus /> Add Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="text-gray-500 col-span-full text-center py-10">Loading plans...</div>
                ) : plans.map(plan => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={plan.id}
                        className={`bg-white rounded-xl p-6 border relative transition-all group hover:shadow-lg hover:-translate-y-1
                            ${plan.is_active ? 'border-gray-200 hover:border-blue-500/50' : 'border-red-200 opacity-75'}`}
                    >
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => handleToggleActive(plan)}
                                className={`p-1.5 rounded-full text-xs font-bold transition-colors
                                    ${plan.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                title={plan.is_active ? "Deactivate" : "Activate"}
                            >
                                {plan.is_active ? <FiCheck /> : <FiX />}
                            </button>
                            <button
                                onClick={() => handleOpenModal(plan)}
                                className="p-1.5 bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
                            >
                                <FiEdit />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
                                <FiBriefcase size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 truncate pr-16">{plan.name}</h3>
                            <p className="text-gray-500 text-sm h-10 overflow-hidden text-ellipsis">{plan.description || 'No description'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <div className="text-gray-400 text-xs uppercase">ROI</div>
                                <div className="text-blue-600 font-bold text-lg">{plan.roi_percentage}%</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs uppercase">Duration</div>
                                <div className="text-gray-900 font-bold text-lg">{plan.duration_months} mo</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs uppercase">Profit (M)</div>
                                <div className="text-green-600 font-medium">{plan.monthly_profit_percentage ? `${plan.monthly_profit_percentage}%` : '-'}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xs uppercase">Profit (Q)</div>
                                <div className="text-green-600 font-medium">{plan.quarterly_profit_percentage ? `${plan.quarterly_profit_percentage}%` : '-'}</div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
                            <div className="flex justify-between">
                                <span>Min Investment:</span>
                                <span className="text-gray-900 font-mono">₹{plan.min_amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Max Investment:</span>
                                <span className="text-gray-900 font-mono">₹{plan.max_amount}</span>
                            </div>
                            {plan.maturity_bonus && Object.keys(plan.maturity_bonus).length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-100">
                                    <span className="block text-xs uppercase text-gray-400 mb-1">Maturity Bonus</span>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(plan.maturity_bonus).map(([year, percent]) => (
                                            <span key={year} className="inline-flex items-center px-2 py-1 rounded bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                                                {year} Yr: {percent}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingPlan ? 'Edit Investment Plan' : 'Create New Plan'}
                            </h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-gray-500 text-sm mb-1">Plan Name</label>
                                        <input required type="text" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Total ROI (%)</label>
                                        <input required type="number" step="0.1" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.roi_percentage} onChange={e => setFormData({ ...formData, roi_percentage: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Duration (Months)</label>
                                        <input required type="number" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.duration_months} onChange={e => setFormData({ ...formData, duration_months: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Monthly Profit (%)</label>
                                        <input type="number" step="0.01" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.monthly_profit_percentage} onChange={e => setFormData({ ...formData, monthly_profit_percentage: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Quarterly Profit (%)</label>
                                        <input type="number" step="0.01" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.quarterly_profit_percentage} onChange={e => setFormData({ ...formData, quarterly_profit_percentage: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Min Amount (₹)</label>
                                        <input required type="number" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.min_amount} onChange={e => setFormData({ ...formData, min_amount: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-500 text-sm mb-1">Max Amount (₹)</label>
                                        <input required type="number" className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.max_amount} onChange={e => setFormData({ ...formData, max_amount: e.target.value })} />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-gray-500 text-sm mb-1">Description</label>
                                        <textarea className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="2" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-500 text-sm mb-1">Features (One per line)</label>
                                        <textarea className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:border-blue-500 outline-none"
                                            placeholder="Capital Protection&#10;Instant Withdrawal&#10;24/7 Support"
                                            value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} rows="4" />
                                    </div>

                                    {/* Maturity Bonus Section */}
                                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-gray-700 font-medium text-sm">Maturity Bonus Tiers</label>
                                            <button type="button" onClick={addBonusTier} className="text-blue-600 text-xs font-semibold hover:text-blue-800 flex items-center gap-1">
                                                <FiPlus /> Add Tier
                                            </button>
                                        </div>
                                        
                                        {formData.maturity_bonus.length === 0 ? (
                                            <p className="text-gray-400 text-sm italic text-center py-2">No maturity bonuses added.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {formData.maturity_bonus.map((tier, index) => (
                                                    <div key={index} className="flex gap-4 items-end">
                                                        <div className="flex-1">
                                                            <label className="text-gray-500 text-xs mb-1 block">Year</label>
                                                            <input type="number" placeholder="e.g 3" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                                                                value={tier.year} onChange={e => updateBonusTier(index, 'year', e.target.value)} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="text-gray-500 text-xs mb-1 block">Bonus %</label>
                                                            <input type="number" placeholder="e.g 30" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                                                                value={tier.percentage} onChange={e => updateBonusTier(index, 'percentage', e.target.value)} />
                                                        </div>
                                                        <button type="button" onClick={() => removeBonusTier(index)} className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors" title="Remove">
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm">Save Plan</button>
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
