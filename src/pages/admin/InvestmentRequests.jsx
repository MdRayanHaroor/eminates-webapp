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
    const [signedUrls, setSignedUrls] = useState({});

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

    // Handle Escape key to close modals
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (isActionModalOpen) setIsActionModalOpen(false);
                else if (selectedRequest) setSelectedRequest(null);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isActionModalOpen, selectedRequest]);

    // Fetch signed URLs when a request is selected
    useEffect(() => {
        if (selectedRequest) {
            generateSignedUrls(selectedRequest);
        } else {
            setSignedUrls({});
        }
    }, [selectedRequest]);

    const generateSignedUrls = async (req) => {
        const urls = {};
        const types = [
            { key: 'aadhaar_card_url', label: 'aadhaar' },
            { key: 'pan_card_url', label: 'pan' },
            { key: 'selfie_url', label: 'selfie' }
        ];

        for (const type of types) {
            const path = req[type.key];
            if (path) {
                try {
                    // Assuming path is stored as relative path in DB, e.g., "user_id/aadhaar/filename.jpg"
                    const { data, error } = await supabase
                        .storage
                        .from('kyc_docs')
                        .createSignedUrl(path, 3600); // 1 hour expiry

                    if (data?.signedUrl) {
                        urls[type.key] = data.signedUrl;
                    } else if (error) {
                        console.error(`Error generating signed URL for ${type.label}:`, error);
                    }
                } catch (err) {
                    console.error(`Exception generating URL for ${type.label}:`, err);
                }
            }
        }
        setSignedUrls(urls);
    };

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
        } else if (activeTab === 'active') {
            // Active investments are those that are confirmed
            setFilteredRequests(requests.filter(r => r.is_confirmed === true));
        } else if (activeTab === 'approved') {
            // Approved but not yet confirmed (waiting for payment/UTR)
            // Comparison is now case-insensitive but targeting the new Title Case values
            setFilteredRequests(requests.filter(r => r.status?.toLowerCase() === 'approved' && !r.is_confirmed));
        } else if (activeTab === 'utr_submitted') {
            setFilteredRequests(requests.filter(r => r.status?.toLowerCase() === 'utr submitted'));
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
                if (selectedRequest.status?.toLowerCase() === 'utr submitted' || selectedRequest.status?.toLowerCase() === 'utr_submitted') {
                    updates = {
                        status: 'Investment Confirmed', // Explicit Title Case as requested
                        is_confirmed: true,
                    };
                } else {
                    updates = {
                        status: 'Approved', // Explicit Title Case as requested
                        is_confirmed: false, // Initial approval moves to 'Approved' status, waiting for UTR
                        admin_bank_details: selectedBank // Snapshot selected bank
                    };
                }
            } else {
                if (!rejectionReason.trim()) {
                    alert("Please provide a rejection reason.");
                    setProcessingAction(false);
                    return;
                }
                updates = {
                    status: 'Rejected', // Explicit Title Case as requested
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
            alert(`Failed to update request: ${error.message}`);
        } finally {
            setProcessingAction(false);
        }
    };

    // Helper for status colors
    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'approved') return 'bg-blue-50 text-blue-600 border-blue-200';
        if (s === 'active' || s === 'investment confirmed') return 'bg-green-50 text-green-600 border-green-200';
        if (s === 'pending') return 'bg-yellow-50 text-yellow-600 border-yellow-200';
        if (s === 'utr submitted' || s === 'utr_submitted') return 'bg-purple-50 text-purple-600 border-purple-200';
        if (s === 'rejected') return 'bg-red-50 text-red-600 border-red-200';
        return 'bg-gray-50 text-gray-600 border-gray-200';
    };

    const getStatusLabel = (status) => {
        if (status?.toLowerCase() === 'active') return 'Investment Confirmed';
        return status; // 'Investment Confirmed' will just return itself which is fine
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Investment Requests</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-1">
                {['all', 'pending', 'approved', 'utr_submitted', 'rejected', 'active'].map(status => (
                    <button
                        key={status}
                        onClick={() => setActiveTab(status)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors capitalize whitespace-nowrap
                            ${activeTab === status
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        {status === 'active' ? 'Confirmed (Active)' : status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 uppercase text-xs font-semibold tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Investor</th>
                                <th className="px-6 py-4">Plan & Amount</th>
                                <th className="px-6 py-4">Ref / UTR</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8">Loading requests...</td></tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">No requests found.</td></tr>
                            ) : (
                                filteredRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{req.users?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{req.users?.email}</div>
                                            <div className="text-xs text-gray-500">{req.users?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{req.plan_name}</div>
                                            <div className="text-green-600 font-mono font-medium">₹{Number(req.investment_amount).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{req.transaction_utr || '-'}</td>
                                        <td className="px-6 py-4">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusColor(req.status)}`}>
                                                {getStatusLabel(req.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedRequest(req)}
                                                className="text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium"
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
                            className="bg-white border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Request Details</h2>
                                    <p className="text-gray-500 text-sm">ID: {selectedRequest.id}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><FiX size={20} /></button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Info */}
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Investor Info</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-100">
                                            <p className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="text-gray-900 font-medium">{selectedRequest.users?.full_name}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">Email:</span> <span className="text-gray-900">{selectedRequest.users?.email}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{selectedRequest.primary_mobile || selectedRequest.users?.phone}</span></p>
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Investment Details</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-100">
                                            <p className="flex justify-between"><span className="text-gray-500">Plan:</span> <span className="text-blue-600 font-medium">{selectedRequest.plan_name}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">Amount:</span> <span className="text-green-600 font-bold">₹{selectedRequest.investment_amount}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">UTR Number:</span> <span className="font-mono text-gray-800">{selectedRequest.transaction_utr}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="text-gray-900">{new Date(selectedRequest.created_at).toLocaleString()}</span></p>
                                        </div>
                                    </section>
                                    <section>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bank Details</h3>
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-100">
                                            <p className="flex justify-between"><span className="text-gray-500">Account Holder:</span> <span className="text-gray-900">{selectedRequest.account_holder_name}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">Bank:</span> <span className="text-gray-900">{selectedRequest.bank_name}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">Account No:</span> <span className="font-mono text-gray-900">{selectedRequest.account_number}</span></p>
                                            <p className="flex justify-between"><span className="text-gray-500">IFSC:</span> <span className="font-mono text-gray-900">{selectedRequest.ifsc_code}</span></p>
                                        </div>
                                    </section>
                                </div>

                                {/* Right: Documents */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Documents</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Aadhaar Card', url: signedUrls.aadhaar_card_url, original: selectedRequest.aadhaar_card_url },
                                            { label: 'PAN Card', url: signedUrls.pan_card_url, original: selectedRequest.pan_card_url },
                                            { label: 'Selfie', url: signedUrls.selfie_url, original: selectedRequest.selfie_url },
                                        ].map(doc => (
                                            doc.original ? (
                                                <div key={doc.label} className="group relative block bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-all">
                                                    {/* Check file extension for PDF vs Image */}
                                                    {(doc.original.toLowerCase().includes('.pdf')) ? (
                                                        <div className="h-40 flex flex-col items-center justify-center p-4">
                                                            <div className="text-4xl text-red-500 mb-2">📄</div>
                                                            <span className="text-xs text-gray-500 font-mono text-center break-all px-2">PDF Document</span>
                                                        </div>
                                                    ) : (
                                                        <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                                                            {doc.url ? (
                                                                <img src={doc.url} alt={doc.label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full w-full text-gray-400 text-xs">Loading...</div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay with Actions */}
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                        {doc.url ? (
                                                            <>
                                                                <a
                                                                    href={doc.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <FiEye size={14} /> View
                                                                </a>
                                                                <a
                                                                    href={doc.url}
                                                                    download
                                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                                                >
                                                                    <FiDownload size={14} /> Download
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <span className="text-white text-xs">Generating Link...</span>
                                                        )}
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 p-1 text-center text-xs text-white backdrop-blur-sm">
                                                        {doc.label}
                                                    </div>
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                    {(!selectedRequest.aadhaar_card_url && !selectedRequest.pan_card_url && !selectedRequest.selfie_url) && (
                                        <div className="text-gray-400 text-sm italic border-l-2 border-gray-200 pl-4 py-2">No documents uploaded for this request.</div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                                {selectedRequest.status?.toLowerCase() === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleOpenAction('reject', selectedRequest)}
                                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium border border-red-200"
                                        >
                                            Reject Request
                                        </button>
                                        <button
                                            onClick={() => handleOpenAction('approve', selectedRequest)}
                                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all font-medium shadow-md shadow-green-200"
                                        >
                                            Approve Investment
                                        </button>
                                    </>
                                )}
                                {(selectedRequest.status?.toLowerCase() === 'utr submitted' || selectedRequest.status?.toLowerCase() === 'utr_submitted') && (
                                    <>
                                        <button
                                            onClick={() => handleOpenAction('reject', selectedRequest)}
                                            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all font-medium border border-red-200"
                                        >
                                            Reject Request
                                        </button>
                                        <button
                                            onClick={() => handleOpenAction('approve', selectedRequest)}
                                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all font-medium shadow-md shadow-green-200"
                                        >
                                            Confirm Investment
                                        </button>
                                    </>
                                )}
                                <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200">Close</button>
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
                            className="bg-white border border-gray-200 w-full max-w-md rounded-xl shadow-2xl p-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {actionType === 'approve' ? 'Approve Investment' : 'Reject Request'}
                            </h3>

                            {actionType === 'approve' ? (
                                <div className="space-y-4">
                                    {(selectedRequest?.status?.toLowerCase() === 'utr submitted' || selectedRequest?.status?.toLowerCase() === 'utr_submitted') ? (
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                            <p className="text-green-800 text-sm font-semibold mb-1">Confirm Investment?</p>
                                            <p className="text-green-700 text-sm">
                                                The user has submitted UTR: <span className="font-mono font-bold">{selectedRequest.transaction_utr}</span>.
                                                <br />
                                                Clicking confirm will activate this investment plan.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-gray-500 text-sm">Please select the bank account where the user should deposit the funds.</p>
                                            {adminBanks.length > 0 ? (
                                                <div className="space-y-2">
                                                    {adminBanks.map((bank, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedBank === bank ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}
                                                            onClick={() => setSelectedBank(bank)}
                                                        >
                                                            <div className="font-bold text-gray-900 text-sm">{bank.bank_name || 'Bank Name'}</div>
                                                            <div className="text-xs text-gray-500">{bank.account_number}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded text-sm">
                                                    No admin bank accounts found in settings.
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-gray-500 text-sm">Please provide a reason for rejection. This will be visible to the user.</p>
                                    <textarea
                                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
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
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
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
