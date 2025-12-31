import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FiArrowLeft, FiUser, FiCreditCard, FiActivity, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            // 1. Fetch User Profile
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError) throw userError;

            // 2. Fetch User Investments
            const { data: invData, error: invError } = await supabase
                .from('investor_requests')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (invError) console.error("Error fetching investments:", invError);

            setUser(userData);
            setInvestments(invData || []);
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        if (!user) return;

        // Fetch valid signed URLs for all documents
        const signedDocs = {};
        try {
            for (const inv of investments) {
                const docs = [
                    { key: 'aadhaar_card_url', id: inv.id, path: inv.aadhaar_card_url },
                    { key: 'pan_card_url', id: inv.id, path: inv.pan_card_url },
                    { key: 'selfie_url', id: inv.id, path: inv.selfie_url }
                ];

                for (const doc of docs) {
                    if (doc.path) {
                        const { data } = await supabase.storage.from('kyc_docs').createSignedUrl(doc.path, 3600 * 24); // 24 hours validity
                        if (data?.signedUrl) {
                            signedDocs[`${inv.id}_${doc.key}`] = data.signedUrl;
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Error generating signed URLs for PDF:", err);
        }

        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("Investor Details Report", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
        doc.text(`User ID: ${user.id}`, 14, 33);

        // Section: Personal Info
        doc.setDrawColor(200);
        doc.line(14, 35, 196, 35);

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Personal Information", 14, 45);

        const infoData = [
            ["Full Name", user.full_name || '-'],
            ["Email", user.email || '-'],
            ["Phone", user.phone || '-'],
            ["Joined Date", new Date(user.created_at).toLocaleDateString()],
            ["Role", user.role || 'User'],
        ];

        doc.autoTable({
            startY: 50,
            head: [['Field', 'Value']],
            body: infoData,
            theme: 'striped',
            headStyles: { fillColor: [66, 133, 244] },
            margin: { left: 14, right: 14 }
        });

        // Section: Investment History
        let finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Investment History & Documents", 14, finalY);

        const investmentRows = investments.map(inv => [
            inv.plan_name,
            `Rs. ${inv.investment_amount}`,
            new Date(inv.created_at).toLocaleDateString(),
            inv.status,
            inv.transaction_utr || '-'
        ]);

        doc.autoTable({
            startY: finalY + 5,
            head: [['Plan', 'Amount', 'Date', 'Status', 'UTR']],
            body: investmentRows,
            theme: 'grid',
            headStyles: { fillColor: [52, 168, 83] },
            margin: { left: 14, right: 14 }
        });

        // Section: Document Links
        finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(14);
        doc.text("Uploaded Documents", 14, finalY);

        let docY = finalY + 10;
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 200); // Blue for links

        if (investments.length > 0) {
            investments.forEach((inv, index) => {
                if (inv.aadhaar_card_url || inv.pan_card_url || inv.selfie_url) {
                    doc.setTextColor(0);
                    doc.text(`Request #${index + 1} (${inv.plan_name}) - ${new Date(inv.created_at).toLocaleDateString()}:`, 14, docY);
                    docY += 7;
                    doc.setTextColor(50, 50, 200);

                    if (inv.aadhaar_card_url) {
                        const url = signedDocs[`${inv.id}_aadhaar_card_url`] || inv.aadhaar_card_url;
                        doc.textWithLink("View Aadhaar Card", 20, docY, { url: url });
                        docY += 6;
                    }
                    if (inv.pan_card_url) {
                        const url = signedDocs[`${inv.id}_pan_card_url`] || inv.pan_card_url;
                        doc.textWithLink("View PAN Card", 20, docY, { url: url });
                        docY += 6;
                    }
                    if (inv.selfie_url) {
                        const url = signedDocs[`${inv.id}_selfie_url`] || inv.selfie_url;
                        doc.textWithLink("View Selfie", 20, docY, { url: url });
                        docY += 6;
                    }
                    docY += 4;
                }
            });
        } else {
            doc.setTextColor(100);
            doc.text("No documents found.", 14, docY);
            docY += 10;
        }

        // Section: Bank Details (from latest request)
        if (investments.length > 0) {
            const latest = investments[0];
            finalY = docY + 10;

            // Check page break
            if (finalY > 250) {
                doc.addPage();
                finalY = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Bank Details (Latest)", 14, finalY);

            const bankData = [
                ["Bank Name", latest.bank_name || '-'],
                ["Account Holder", latest.account_holder_name || '-'],
                ["Account Number", latest.account_number || '-'],
                ["IFSC Code", latest.ifsc_code || '-'],
            ];

            doc.autoTable({
                startY: finalY + 5,
                body: bankData,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 2 },
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
                margin: { left: 14 }
            });
        }

        doc.save(`user_report_${user.full_name?.replace(/\s+/g, '_')}_${user.id.slice(0, 6)}.pdf`);
    };

    if (loading) return <div className="text-white p-8">Loading profile...</div>;
    if (!user) return <div className="text-white p-8">User not found</div>;

    // Extract bank details from latest investment or return null
    const latestInvestment = investments.length > 0 ? investments[0] : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.full_name || 'Unknown User'}</h1>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                    <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border capitalize
                            ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' :
                                user.role === 'agent' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                    'bg-blue-50 text-blue-600 border-blue-200'}`}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <FiDownload /> Download Report
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex gap-6">
                {['overview', 'investments', 'bank_details'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium capitalize transition-colors relative
                            ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        {tab.replace('_', ' ')}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiUser className="text-blue-500" /> Personal Info
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-500 block">Full Name</label>
                                        <p className="text-gray-900 font-medium">{user.full_name || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-500 block">Phone</label>
                                        <p className="text-gray-900">{user.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-500 block">Joined Date</label>
                                        <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-500 block">User ID</label>
                                        <p className="text-gray-900 font-mono text-xs">{user.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Summary */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiActivity className="text-green-500" /> Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-gray-500 text-xs uppercase">Total Requests</div>
                                    <div className="text-2xl font-bold text-gray-900 mt-1">{investments.length}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-gray-500 text-xs uppercase">Last Active</div>
                                    <div className="text-sm font-medium text-gray-900 mt-2">
                                        {latestInvestment ? new Date(latestInvestment.created_at).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'investments' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {investments.length === 0 ? (
                            <p className="text-gray-500">No investment history found.</p>
                        ) : (
                            investments.map((inv) => (
                                <div key={inv.id} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-300 transition-colors shadow-sm">
                                    <div>
                                        <h4 className="text-gray-900 font-medium">{inv.plan_name}</h4>
                                        <p className="text-gray-500 text-sm">Amount: ₹{inv.investment_amount}</p>
                                        <p className="text-gray-400 text-xs">Date: {new Date(inv.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                                            ${inv.status === 'approved' ? 'bg-green-50 text-green-600' :
                                                inv.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-red-50 text-red-600'}`}>
                                            {inv.status}
                                        </span>
                                        {inv.aadhaar_card_url && (
                                            <a href={inv.aadhaar_card_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500 text-sm flex items-center gap-1">
                                                <FiDownload size={14} /> Docs
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}

                {activeTab === 'bank_details' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 block max-w-2xl shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCreditCard className="text-purple-500" /> Bank Information
                            </h3>
                            {latestInvestment ? (
                                <div className="space-y-4 text-sm">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-gray-500 block mb-1">Account Holder</label>
                                            <div className="font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-100">{latestInvestment.account_holder_name}</div>
                                        </div>
                                        <div>
                                            <label className="text-gray-500 block mb-1">Bank Name</label>
                                            <div className="font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-100">{latestInvestment.bank_name}</div>
                                        </div>
                                        <div>
                                            <label className="text-gray-500 block mb-1">Account Number</label>
                                            <div className="font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-100 font-mono">{latestInvestment.account_number}</div>
                                        </div>
                                        <div>
                                            <label className="text-gray-500 block mb-1">IFSC Code</label>
                                            <div className="font-medium text-gray-900 p-2 bg-gray-50 rounded border border-gray-100 font-mono">{latestInvestment.ifsc_code}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-4 italic">
                                        * Details sourced from most recent investment request (ID: {latestInvestment.id.slice(0, 8)}).
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500">No bank details found (User has not made any investment requests yet).</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
