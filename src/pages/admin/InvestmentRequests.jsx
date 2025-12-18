import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiCheck, FiX, FiEye, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const InvestmentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Action States
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
    const [rejectionReason, setRejectionReason] = useState('');
    const [adminBanks, setAdminBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        fetchRequests();
        fetchAdminBanks();
    }, []);

    useEffect(() => {
        filterRequests();
    }, [activeTab, requests]);

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('investor_requests')
                .select(`*, users (full_name, email, phone)`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminBanks = async () => {
        try {
            // Fetch all rows with key 'bank_details'
            const { data, error } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'bank_details');

            if (data && data.length > 0) {
                // Map the rows to extract the bank object from 'value' column
                const banks = data.map(row => row.value);
                setAdminBanks(banks);
                if (banks.length > 0) setSelectedBank(banks[0]);
            }
        } catch (err) {
            console.error("Error fetching admin banks:", err);
        }
    };

    const filterRequests = () => {
        if (activeTab === 'all') {
            setFilteredRequests(requests);
        } else {
            setFilteredRequests(requests.filter(r => r.status?.toLowerCase() === activeTab));
        }
    };

    const handleOpenAction = (type, req) => {
        setActionType(type);
        setSelectedRequest(req);
        setIsActionModalOpen(true);
        // Reset inputs
        setRejectionReason('');
        if (adminBanks.length > 0) setSelectedBank(adminBanks[0]);
    };

    const submitAction = async () => {
        if (!selectedRequest) return;
        setProcessingAction(true);

        try {
            let updates = {};

            if (actionType === 'approve') {
                updates = {
                    status: 'approved',
                    is_confirmed: true,
                    admin_bank_details: selectedBank // Snapshot selected bank
                };
            } else {
                if (!rejectionReason.trim()) {
                    alert("Please provide a rejection reason.");
                    setProcessingAction(false);
                    return;
                }
                updates = {
                    status: 'rejected',
                    rejection_reason: rejectionReason,
                    is_confirmed: false
                };
            }

            const { error } = await supabase
                .from('investor_requests')
                .update(updates)
                .eq('id', selectedRequest.id);

            if (error) throw error;

            // Success Update UI
            setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, ...updates } : r));
            setIsActionModalOpen(false);
            setSelectedRequest(null);
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Failed to update request status.");
        } finally {
            setProcessingAction(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Investment Requests</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-800 overflow-x-auto pb-1">
                {['all', 'pending', 'approved', 'rejected', 'active'].map(status => (
                    <button
                        key={status}
                        onClick={() => setActiveTab(status)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize whitespace-nowrap
                            ${activeTab === status
                                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 uppercase text-xs font-semibold tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Plan & Amount</th>
                                <th className="px-6 py-4">Ref / UTR</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8">Loading requests...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No requests found.</td></tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{req.users?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{req.users?.email}</div>
                                            <div className="text-xs text-slate-500">{req.users?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white">{req.plan_name}</div>
                                            <div className="text-green-400 font-mono font-medium">₹{Number(req.investment_amount).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{req.transaction_utr || '-'}</td>
                                        <td className="px-6 py-4">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border
                                                ${req.status === 'approved' || req.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="text-blue-400 hover:text-white px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-xs font-medium"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedRequest && !isActionModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-start sticky top-0 bg-slate-900 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Request Details</h2>
                                    <p className="text-slate-400 text-sm">ID: {selectedRequest.id}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><FiX size={20} /></button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Info */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Investor Info</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
                                            <p className="flex justify-between"><span className="text-slate-400">Name:</span> <span className="text-white">{selectedRequest.users?.full_name}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="text-white">{selectedRequest.users?.email}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">Phone:</span> <span className="text-white">{selectedRequest.primary_mobile || selectedRequest.users?.phone}</span></p>
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Investment Details</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
                                            <p className="flex justify-between"><span className="text-slate-400">Plan:</span> <span className="text-blue-400 font-medium">{selectedRequest.plan_name}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">Amount:</span> <span className="text-green-400 font-bold">₹{selectedRequest.investment_amount}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">UTR Number:</span> <span className="font-mono text-white">{selectedRequest.transaction_utr}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="text-white">{new Date(selectedRequest.created_at).toLocaleString()}</span></p>
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bank Details</h3>
                                        <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm">
                                            <p className="flex justify-between"><span className="text-slate-400">Account Holder:</span> <span className="text-white">{selectedRequest.account_holder_name}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">Bank:</span> <span className="text-white">{selectedRequest.bank_name}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">Account No:</span> <span className="font-mono text-white">{selectedRequest.account_number}</span></p>
                                            <p className="flex justify-between"><span className="text-slate-400">IFSC:</span> <span className="font-mono text-white">{selectedRequest.ifsc_code}</span></p>
                                        </div>
                                    </section>
                                </div>

                                {/* Right: Documents */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Documents</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Aadhaar Card', url: selectedRequest.aadhaar_card_url },
                                            { label: 'PAN Card', url: selectedRequest.pan_card_url },
                                            { label: 'Selfie', url: selectedRequest.selfie_url },
                                        ].map(doc => (
                                            doc.url ? (
                                                <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer" className="group relative block bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-500 transition-all aspect-square">
                                                    <img src={doc.url} alt={doc.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-xs font-bold flex items-center gap-1"><FiEye /> View</span>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center text-xs text-white">
                                                        {doc.label}
                                                    </div>
                                                </a>
                                            ) : null
                                        ))}
                                    </div>
                                    {(!selectedRequest.aadhaar_card_url && !selectedRequest.pan_card_url && !selectedRequest.selfie_url) && (
                                        <div className="text-slate-500 text-sm italic">No documents uploaded.</div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900">
                                {selectedRequest.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleOpenAction('reject', selectedRequest)}
                                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-medium border border-red-500/50"
                                        >
                                            Reject Request
                                        </button>
                                        <button
                                            onClick={() => handleOpenAction('approve', selectedRequest)}
                                            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all font-medium shadow-lg shadow-green-500/20"
                                        >
                                            Approve Investment
                                        </button>
                                    </>
                                )}
                                <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700">Close</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Approval/Rejection Modal */}
            <AnimatePresence>
                {isActionModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-white mb-4">
                                {actionType === 'approve' ? 'Approve Investment' : 'Reject Request'}
                            </h3>

                            {actionType === 'approve' ? (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Please select the bank account where the user should deposit the funds (or where the UTR was verified).</p>
                                    {adminBanks.length > 0 ? (
                                        <div className="space-y-2">
                                            {adminBanks.map((bank, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedBank === bank ? 'border-green-500 bg-green-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                                                    onClick={() => setSelectedBank(bank)}
                                                >
                                                    <div className="font-bold text-white text-sm">{bank.bank_name || 'Bank Name'}</div>
                                                    <div className="text-xs text-slate-400">{bank.account_number}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 rounded text-sm">
                                            No admin bank accounts found in settings.
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-sm">Please provide a reason for rejection. This will be visible to the user.</p>
                                    <textarea
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                                        rows="4"
                                        placeholder="Reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    ></textarea>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsActionModalOpen(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    disabled={processingAction}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitAction}
                                    disabled={processingAction}
                                    className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2
                                        ${actionType === 'approve' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}
                                        ${processingAction ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {processingAction ? 'Processing...' : (actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InvestmentRequests;
