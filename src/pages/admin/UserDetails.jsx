import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { FiArrowLeft, FiDownload, FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiDollarSign, FiClock, FiFileText, FiLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError) throw userError;
            setUser(userData);

            const { data: investmentData, error: investmentError } = await supabase
                .from('investor_requests')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (investmentError) throw investmentError;
            setInvestments(investmentData);

        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = async () => {
        if (!user) return;
        setIsDownloading(true);

        try {
            // 1. Refetch fresh data to ensure accuracy
            const { data: freshUser, error: uErr } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            if (uErr) throw uErr;

            const { data: freshInvestments, error: iErr } = await supabase
                .from('investor_requests')
                .select('*, payouts(*)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (iErr) throw iErr;

            // Manual fetch for payouts to ensure we get everything linked by request_id
            const requestIds = freshInvestments.map(inv => inv.id);
            let freshPayouts = [];
            if (requestIds.length > 0) {
                const { data: pData, error: pErr } = await supabase
                    .from('payouts')
                    .select('*')
                    .in('request_id', requestIds)
                    .order('created_at', { ascending: false });

                if (!pErr && pData) freshPayouts = pData;
            }

            // Fetch valid signed URLs for all documents
            const signedDocs = {};
            try {
                for (const inv of freshInvestments) {
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
            doc.text(`User ID: ${freshUser.id}`, 14, 33);

            // Personal Info
            doc.setDrawColor(200);
            doc.line(14, 35, 196, 35);

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Personal Information", 14, 45);

            const infoData = [
                ["Full Name", freshUser.full_name || '-'],
                ["Email", freshUser.email || '-'],
                ["Phone", freshUser.phone || '-'],
                ["Joined Date", new Date(freshUser.created_at).toLocaleDateString()],
                ["Role", freshUser.role || 'User'],
            ];

            autoTable(doc, {
                startY: 50,
                head: [['Field', 'Value']],
                body: infoData,
                theme: 'striped',
                headStyles: { fillColor: [66, 133, 244] },
                margin: { left: 14, right: 14 }
            });

            // Investment History
            let finalY = (doc.lastAutoTable?.finalY || 50) + 15;
            doc.setFontSize(14);
            doc.text("Investment History", 14, finalY);

            const investmentRows = freshInvestments.map(inv => [
                inv.plan_name,
                `Rs. ${inv.investment_amount}`,
                new Date(inv.created_at).toLocaleDateString(),
                inv.status,
                inv.transaction_utr || '-'
            ]);

            autoTable(doc, {
                startY: finalY + 5,
                head: [['Plan', 'Amount', 'Date', 'Status', 'UTR']],
                body: investmentRows,
                theme: 'grid',
                headStyles: { fillColor: [52, 168, 83] }, // Green
                margin: { left: 14, right: 14 }
            });

            // Payouts History
            finalY = (doc.lastAutoTable?.finalY || 100) + 15;

            if (freshPayouts.length > 0) {
                if (finalY > 250) { doc.addPage(); finalY = 20; }

                doc.setFontSize(14);
                doc.text("Payouts History", 14, finalY);

                const payoutRows = freshPayouts.map(p => {
                    const relatedReq = freshInvestments.find(r => r.id === p.request_id);
                    return [
                        new Date(p.created_at).toLocaleDateString(),
                        relatedReq ? relatedReq.plan_name : '-',
                        p.type,
                        `Rs. ${p.amount}`,
                        p.status,
                        p.transaction_utr || '-'
                    ];
                });

                autoTable(doc, {
                    startY: finalY + 5,
                    head: [['Date', 'Plan', 'Type', 'Amount', 'Status', 'UTR']],
                    body: payoutRows,
                    theme: 'grid',
                    headStyles: { fillColor: [255, 170, 0] }, // Orange
                    margin: { left: 14, right: 14 }
                });

                finalY = doc.lastAutoTable.finalY + 15;
            }

            // Document Links
            if (finalY > 250) { doc.addPage(); finalY = 20; }

            doc.setFontSize(14);
            doc.text("Uploaded Documents", 14, finalY);

            let docY = finalY + 10;
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 200); // Blue for links

            if (freshInvestments.length > 0) {
                freshInvestments.forEach((inv, index) => {
                    const hasDocs = inv.aadhaar_card_url || inv.pan_card_url || inv.selfie_url;
                    if (hasDocs) {
                        if (docY > 270) { doc.addPage(); docY = 20; }

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

            // Bank Details
            if (freshInvestments.length > 0) {
                const latest = freshInvestments[0];
                finalY = docY + 10;

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

                autoTable(doc, {
                    startY: finalY + 5,
                    body: bankData,
                    theme: 'plain',
                    styles: { fontSize: 10, cellPadding: 2 },
                    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
                    margin: { left: 14 }
                });
            }

            doc.save(`user_report_${freshUser.full_name?.replace(/\s+/g, '_')}_${freshUser.id.slice(0, 6)}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert(`Failed to generate PDF: ${error.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">User not found</p>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                    Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
                <FiArrowLeft /> Back to Users
            </button>

            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.full_name}</h1>
                    <div className="flex items-center gap-4 mt-2 text-gray-500">
                        <span className="flex items-center gap-2">
                            <FiMail /> {user.email}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiPhone /> {user.phone}
                        </span>
                        <span className="flex items-center gap-2">
                            <FiCalendar /> Joined {new Date(user.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiDownload className={isDownloading ? 'animate-bounce' : ''} />
                    {isDownloading ? 'Downloading...' : 'Download Report'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                    <nav className="flex gap-6 px-6">
                        {['overview', 'documents', 'investments'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors capitalize ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiUser className="text-blue-500" /> Basic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium text-gray-900">{user.full_name}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Email Address</p>
                                        <p className="font-medium text-gray-900">{user.email}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="font-medium text-gray-900">{user.phone}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Role</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1 ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiDollarSign className="text-green-500" /> Bank Details
                                </h3>
                                {investments.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Bank Name</p>
                                            <p className="font-medium text-gray-900">{investments[0].bank_name}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Account Holder</p>
                                            <p className="font-medium text-gray-900">{investments[0].account_holder_name}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Account Number</p>
                                            <p className="font-medium text-gray-900">{investments[0].account_number}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">IFSC Code</p>
                                            <p className="font-medium text-gray-900">{investments[0].ifsc_code}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-500">No bank details available</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}

                    {activeTab === 'investments' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-sm text-blue-600 font-medium mb-1">Total Investments</p>
                                    <p className="text-3xl font-bold text-blue-900">{investments.length}</p>
                                </div>
                                <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-sm text-green-600 font-medium mb-1">Total Amount</p>
                                    <p className="text-3xl font-bold text-green-900">
                                        Rs. {investments.reduce((sum, inv) => sum + (parseFloat(inv.investment_amount) || 0), 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {investments.map((inv) => (
                                    <div key={inv.id} className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:border-blue-200 transition-colors">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 text-lg">{inv.plan_name}</h4>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <FiCalendar /> {new Date(inv.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiClock /> {new Date(inv.created_at).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-gray-900">Rs. {inv.investment_amount}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-2 ${inv.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                    inv.status === 'active' || inv.status === 'investment confirmed' ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </div>
                                        </div>
                                        {inv.transaction_utr && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Transaction UTR:</span> {inv.transaction_utr}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {investments.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-500">No investment history found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {investments.map((inv) => (
                                <React.Fragment key={inv.id}>
                                    {inv.aadhaar_card_url && (
                                        <DocumentCard
                                            title="Aadhaar Card"
                                            url={inv.aadhaar_card_url}
                                            date={inv.created_at}
                                            plan={inv.plan_name}
                                        />
                                    )}
                                    {inv.pan_card_url && (
                                        <DocumentCard
                                            title="PAN Card"
                                            url={inv.pan_card_url}
                                            date={inv.created_at}
                                            plan={inv.plan_name}
                                        />
                                    )}
                                    {inv.selfie_url && (
                                        <DocumentCard
                                            title="Selfie"
                                            url={inv.selfie_url} // Assuming selfie_url exists in schema
                                            date={inv.created_at}
                                            plan={inv.plan_name}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                            {investments.length === 0 && (
                                <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-gray-500">No documents uploaded</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DocumentCard = ({ title, url, date, plan }) => {
    // Logic to handle signed URLs locally for the preview card if needed (component specific)
    // For now, simpler implementation:
    const handleView = async () => {
        try {
            const { data, error } = await supabase.storage.from('kyc_docs').createSignedUrl(url, 60);
            if (data?.signedUrl) window.open(data.signedUrl, '_blank');
        } catch (e) {
            console.error("Could not open document", e);
            alert("Could not open document");
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-200 transition-colors group">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                    <FiFileText size={20} />
                </div>
                <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
            <p className="text-xs text-gray-500 mb-4">Plan: {plan}</p>
            <button
                onClick={handleView}
                className="w-full py-2 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <FiLink size={14} /> View Document
            </button>
        </div>
    );
};

export default UserDetails;
