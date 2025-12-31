import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiCheckCircle, FiSearch, FiFilter, FiUploadCloud, FiDownload, FiX, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
const Payouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]); // For filter dropdown

    // Feedback State
    const [formFeedback, setFormFeedback] = useState({ type: '', message: '' });
    const [reportFeedback, setReportFeedback] = useState({ type: '', message: '' });

    // Add Payout Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        request_id: '',
        type: 'Profit',
        amount: '',
        status: 'Paid',
        transaction_utr: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [submitting, setSubmitting] = useState(false);

    // Report Filter Modal State
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportFilters, setReportFilters] = useState({
        userId: 'all',
        startDate: '',
        endDate: new Date().toISOString().split('T')[0]
    });
    const [generatingReport, setGeneratingReport] = useState(false);

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (isModalOpen) setIsModalOpen(false);
                else if (isReportModalOpen) setIsReportModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isModalOpen, isReportModalOpen]);

    useEffect(() => {
        fetchPayouts();
        fetchActiveRequests();
        // Users are now derived from payouts to only show relevant ones
    }, []);

    // Extract unique users from payouts for the filter dropdown
    useEffect(() => {
        if (payouts.length > 0) {
            const uniqueUsersMap = new Map();
            payouts.forEach(p => {
                const user = p.investor_requests?.users;
                if (user && user.id && !uniqueUsersMap.has(user.id)) {
                    uniqueUsersMap.set(user.id, user);
                }
            });
            // Convert map values to array and sort by name
            const uniqueUsers = Array.from(uniqueUsersMap.values()).sort((a, b) =>
                (a.full_name || '').localeCompare(b.full_name || '')
            );
            setUsers(uniqueUsers);
        } else {
            setUsers([]);
        }
    }, [payouts]);

    const fetchActiveRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('investor_requests')
                .select('id, full_name, plan_name, investment_amount, status')
                .order('created_at', { ascending: false });

            if (data) {
                // Filter where status is 'active' or 'investment confirmed' or 'approved'
                const active = data.filter(r => {
                    const s = r.status?.toLowerCase()?.trim();
                    return s === 'active' || s === 'investment confirmed' || s === 'approved';
                });
                setRequests(active);
            }
        } catch (err) {
            console.error('Unexpected error fetching requests:', err);
        }
    };

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
                        users (full_name, email, id)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayouts(data || []);
        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setFormData({
            request_id: '',
            type: 'Profit',
            amount: '',
            status: 'Paid',
            transaction_utr: '',
            date: new Date().toISOString().split('T')[0]
        });
        setFormFeedback({ type: '', message: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormFeedback({ type: '', message: '' });

        try {
            const { error } = await supabase
                .from('payouts')
                .insert([{
                    request_id: formData.request_id,
                    type: formData.type,
                    amount: formData.amount,
                    status: formData.status,
                    transaction_utr: formData.transaction_utr,
                    created_at: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
                }]);

            if (error) throw error;

            setIsModalOpen(false);
            fetchPayouts(); // Refresh list
            // Optionally show success somewhere else, but modal closing is enough indication or we can show a top banner temporarily?
            // For now, modal close + list update is standard. We can show alert if user insists on feedback, but let's stick to "alternatives with labels".
            // Since modal closes, maybe just no feedback is fine? Or we can keep modal open and show "Saved!"?
            // Usually closing modal is enough success feedback.
            alert('Payout recorded successfully');
        } catch (error) {
            console.error('Error creating payout:', error);
            setFormFeedback({ type: 'error', message: 'Failed to create payout. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const generateReport = async () => {
        setGeneratingReport(true);
        setReportFeedback({ type: 'info', message: 'Generating report...' });

        try {
            let query = supabase
                .from('payouts')
                .select(`
                    *,
                    investor_requests (
                        plan_name,
                        users (full_name, email, phone)
                    )
                `)
                .order('created_at', { ascending: false });

            // Apply Filters
            if (reportFilters.userId !== 'all') {
                // We need to filter by the user ID in the related table. 
                // Supabase doesn't support deep filtering easily in one go for 1:M:1 like this strictly without join syntax nuances.
                // Easier approach: Get all filtered by date first, then filter in JS for specific user if relational filter is tricky.
                // However, let's try strict inner join filter if possible, or just JS filter for safety and speed on small datasets.
                // JS Filter is safer for now.
            }

            if (reportFilters.startDate) {
                query = query.gte('created_at', reportFilters.startDate);
            }
            if (reportFilters.endDate) {
                // Add time to end date to include the whole day
                const end = new Date(reportFilters.endDate);
                end.setHours(23, 59, 59, 999);
                query = query.lte('created_at', end.toISOString());
            }

            const { data: reportData, error } = await query;

            if (error) throw error;

            // JS Filtering for User
            let finalData = reportData;
            if (reportFilters.userId !== 'all') {
                finalData = reportData.filter(p => p.investor_requests?.users?.id === reportFilters.userId); // Note: users object structure check needed
                // Actually, wait, investor_requests returns users object. We need to match it.
                // Typically we'd need user_id on payouts or filter via request.
                // Let's assume we can filter by matching the user's name/email derived or if we had user_id on payouts.
                // If we don't have user_id on payouts, we rely on investor_requests.users.
                // For exact ID match, we need to know the structure. 
                // Let's rely on the fetched 'payouts' state logic which has the full graph.
                // Better yet, let's just filter the 'payouts' state we already have if we trust it, or re-fetch.
                // Re-fetching is better for 'date' ensuring we get historical if not loaded.

                // Correction: The query above fetches `investor_requests(..., users(...))`. 
                // We can't easily filter by user_id inside the nested relation in top-level select.
                // So JS filter is the way.

                // We need to check if we have the user ID in the response. The select included `users(full_name...)`. 
                // Let's add `id` to the select.
            }

            // Let's re-run query with correct select for User ID to be sure
            const { data: fullData, error: fullErr } = await supabase
                .from('payouts')
                .select(`
                    *,
                    investor_requests (
                        plan_name,
                        user_id,
                        users (full_name, email, phone, id)
                    )
                `)
                .gte('created_at', reportFilters.startDate || '2000-01-01')
                .lte('created_at', (reportFilters.endDate ? new Date(reportFilters.endDate + 'T23:59:59') : new Date()).toISOString())
                .order('created_at', { ascending: false });

            if (fullErr) throw fullErr;

            let filtered = fullData;
            if (reportFilters.userId !== 'all') {
                filtered = fullData.filter(p => p.investor_requests?.user_id === reportFilters.userId);
            }

            if (filtered.length === 0) {
                setReportFeedback({ type: 'error', message: "No payouts found for the selected criteria" });
                setGeneratingReport(false);
                return;
            }

            // Generate PDF
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.text("Payouts Report", 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            const periodStr = `${reportFilters.startDate || 'All Time'} to ${reportFilters.endDate || 'Now'}`;
            doc.text(`Period: ${periodStr}`, 14, 28);
            if (reportFilters.userId !== 'all') {
                // Try to find user name
                const uName = users.find(u => u.id === reportFilters.userId)?.full_name || 'Specific User';
                doc.text(`User: ${uName}`, 14, 33);
            } else {
                doc.text(`User: All Users`, 14, 33);
            }

            const tableRows = filtered.map(p => [
                new Date(p.created_at).toLocaleDateString(),
                p.investor_requests?.users?.full_name || '-',
                p.investor_requests?.plan_name || '-',
                p.type,
                `Rs. ${p.amount}`,
                p.status,
                p.transaction_utr || '-'
            ]);

            autoTable(doc, {
                startY: 40,
                head: [['Date', 'User', 'Plan', 'Type', 'Amount', 'Status', 'UTR']],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185] },
                styles: { fontSize: 9 },
            });

            // Calculate Totals
            const totalAmount = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
            const finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text(`Total Payouts: Rs. ${totalAmount.toLocaleString()}`, 14, finalY);
            doc.text(`Total Count: ${filtered.length}`, 14, finalY + 7);

            doc.save(`payouts_report_${new Date().getTime()}.pdf`);
            setReportFeedback({ type: 'success', message: 'Report downloaded successfully!' });
            // Don't close immediately so user sees success message, or close? Let's keep open for a moment or let user close.
            // Actually, usually on download we might close. Let's keep open to show success.

        } catch (err) {
            console.error("Report Error:", err);
            setReportFeedback({ type: 'error', message: "Failed to generate report" });
        } finally {
            setGeneratingReport(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setIsReportModalOpen(true); setReportFeedback({ type: '', message: '' }); }}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-sm"
                    >
                        <FiDownload /> Report
                    </button>
                    <button
                        onClick={handleOpenModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 shadow-sm"
                    >
                        <FiUploadCloud /> Add Payout
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                            <tr>
                                <th className="py-4 px-6">User / Plan</th>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6">Amount</th>
                                <th className="py-4 px-6">UTR</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">Loading...</td></tr>
                            ) : payouts.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">No payouts found</td></tr>
                            ) : payouts.map(payout => (
                                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-medium text-gray-900">
                                            {payout.investor_requests?.users?.full_name || 'Unknown User'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {payout.investor_requests?.plan_name || 'Unknown Plan'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${payout.type === 'Profit' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                                            {payout.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-900 font-mono font-medium">₹{payout.amount}</td>
                                    <td className="py-4 px-6 font-mono text-xs">{payout.transaction_utr || '-'}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${payout.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-sm">{new Date(payout.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payout Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-gray-200 w-full max-w-lg rounded-xl shadow-2xl p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Record New Payout</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Investment Request</label>
                                    <select
                                        required
                                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                        value={formData.request_id}
                                        onChange={e => setFormData({ ...formData, request_id: e.target.value })}
                                    >
                                        <option value="">Select Investment Request</option>
                                        {requests.map(req => (
                                            <option key={req.id} value={req.id}>
                                                {req.full_name} - {req.plan_name} (₹{req.investment_amount})
                                            </option>
                                        ))}
                                    </select>
                                    {requests.length === 0 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            No eligible investment requests found (Status must be 'Active' or 'Investment Confirmed').
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Type</label>
                                        <select
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="Profit">Profit</option>
                                            <option value="Bonus">Bonus</option>
                                            <option value="Principle">Principle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Amount (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
                                        <select
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="Paid">Paid</option>
                                            <option value="Scheduled">Scheduled</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Transaction UTR</label>
                                    <input
                                        type="text"
                                        placeholder="Optional for Scheduled"
                                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none font-mono"
                                        value={formData.transaction_utr}
                                        onChange={e => setFormData({ ...formData, transaction_utr: e.target.value })}
                                    />
                                </div>

                                {formFeedback.message && (
                                    <div className={`text-sm p-3 rounded-lg ${formFeedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        {formFeedback.message}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : 'Record Payout'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Filter & Generate Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white border border-gray-200 w-full max-w-md rounded-xl shadow-2xl p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Generate Payouts Report</h2>
                                <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Filter by User</label>
                                    <select
                                        className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                        value={reportFilters.userId}
                                        onChange={e => setReportFilters({ ...reportFilters, userId: e.target.value })}
                                    >
                                        <option value="all">All Users</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                            value={reportFilters.startDate}
                                            onChange={e => setReportFilters({ ...reportFilters, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:border-blue-500 outline-none"
                                            value={reportFilters.endDate}
                                            onChange={e => setReportFilters({ ...reportFilters, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {reportFeedback.message && (
                                    <div className={`text-sm p-3 rounded-lg ${reportFeedback.type === 'error' ? 'bg-red-50 text-red-600' :
                                        reportFeedback.type === 'success' ? 'bg-green-50 text-green-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                        {reportFeedback.message}
                                    </div>
                                )}

                                <div className="pt-4 mt-2">
                                    <button
                                        onClick={generateReport}
                                        disabled={generatingReport}
                                        className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-sm disabled:opacity-50 transition-colors"
                                    >
                                        {generatingReport ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <FiDownload /> Download Report PDF
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Payouts;
