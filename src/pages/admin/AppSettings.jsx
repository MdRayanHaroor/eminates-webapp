import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiSave, FiPlus, FiTrash2, FiSmartphone, FiCreditCard } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const AppSettings = () => {
    const [activeTab, setActiveTab] = useState('banks');
    const [loading, setLoading] = useState(true);

    // Bank Settings State
    const [bankSettingsId, setBankSettingsId] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [savingBanks, setSavingBanks] = useState(false);

    // App Versions State
    const [versions, setVersions] = useState([]);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [newVersion, setNewVersion] = useState({
        version: '',
        build_number: '',
        platform: 'android',
        force_update: false,
        download_url: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchBankSettings(), fetchAppVersions()]);
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- BANK SETTINGS LOGIC ---
    const fetchBankSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*')
                .eq('key', 'bank_details');

            if (error) {
                if (error.code !== 'PGRST116') console.error("Error fetching banks:", error);
                setBankAccounts([]);
            } else if (data) {
                // Map DB JSON structure (User provided keys) to UI State
                // DB: { account_name, account_no, ifsc, bank_name, branch }
                const accounts = data.map(item => {
                    const val = item.value || {};
                    return {
                        bank_name: val.bank_name || '',
                        account_holder_name: val.account_name || '',
                        account_number: val.account_no || '',
                        ifsc_code: val.ifsc || '',
                        branch: val.branch || ''
                    };
                });
                setBankAccounts(accounts);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddBankAccount = () => {
        setBankAccounts([...bankAccounts, { bank_name: '', account_holder_name: '', account_number: '', ifsc_code: '', branch: '' }]);
    };

    const handleRemoveBankAccount = (index) => {
        const newAccounts = [...bankAccounts];
        newAccounts.splice(index, 1);
        setBankAccounts(newAccounts);
    };

    const handleBankChange = (index, field, value) => {
        const newAccounts = [...bankAccounts];
        newAccounts[index] = { ...newAccounts[index], [field]: value };
        setBankAccounts(newAccounts);
    };

    const saveBankSettings = async () => {
        setSavingBanks(true);
        try {
            // 1. Delete all existing 'bank_details' rows to avoid duplication/stale data
            const { error: deleteError } = await supabase
                .from('app_settings')
                .delete()
                .eq('key', 'bank_details');

            if (deleteError) throw deleteError;

            // 2. Insert new rows using DB JSON keys
            if (bankAccounts.length > 0) {
                const newRows = bankAccounts.map(account => ({
                    key: 'bank_details',
                    value: {
                        bank_name: account.bank_name,
                        account_name: account.account_holder_name,
                        account_no: account.account_number,
                        ifsc: account.ifsc_code,
                        branch: account.branch || 'Main'
                    },
                    description: 'Admin Bank Account',
                    is_active: true
                }));

                const { error: insertError } = await supabase
                    .from('app_settings')
                    .insert(newRows);

                if (insertError) throw insertError;
            }

            alert("Bank settings saved successfully.");
            fetchBankSettings();
        } catch (error) {
            console.error("Error saving banks:", error);
            alert("Failed to save bank settings.");
        } finally {
            setSavingBanks(false);
        }
    };

    // --- APP VERSIONS LOGIC ---
    const fetchAppVersions = async () => {
        const { data } = await supabase.from('app_versions').select('*').order('created_at', { ascending: false });
        setVersions(data || []);
    };

    const handleCreateVersion = async () => {
        try {
            const payload = {
                version: newVersion.version,
                build_number: parseInt(newVersion.build_number) || 0,
                platform: newVersion.platform,
                force_update: newVersion.force_update,
                download_url: newVersion.download_url
            };

            const { error } = await supabase.from('app_versions').insert([payload]);
            if (error) throw error;
            setIsVersionModalOpen(false);
            setNewVersion({ version: '', build_number: '', platform: 'android', force_update: false, download_url: '' });
            fetchAppVersions();
        } catch (error) {
            console.error("Error creating version:", error);
            alert("Failed to create version.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">App Settings</h1>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('banks')}
                    className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'banks' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <FiCreditCard /> Bank Accounts
                </button>
                <button
                    onClick={() => setActiveTab('versions')}
                    className={`pb-3 flex items-center gap-2 transition-colors ${activeTab === 'versions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
                >
                    <FiSmartphone /> App Versions
                </button>
            </div>

            {/* Bank Accounts Tab */}
            {activeTab === 'banks' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Admin Bank Accounts</h3>
                                <p className="text-slate-400 text-sm">Manage accounts displayed to users for depositing funds.</p>
                            </div>
                            <button onClick={handleAddBankAccount} className="text-blue-400 hover:text-blue-300 flex items-center gap-2 font-medium">
                                <FiPlus /> Add Account
                            </button>
                        </div>

                        <div className="space-y-4">
                            {bankAccounts.length === 0 && <p className="text-slate-500 text-center py-4">No bank accounts added.</p>}
                            {bankAccounts.map((account, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700 items-end">
                                    <div className="lg:col-span-1">
                                        <label className="text-xs text-slate-500 block mb-1">Bank Name</label>
                                        <input type="text" placeholder="e.g. HDFC Bank" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                                            value={account.bank_name} onChange={e => handleBankChange(index, 'bank_name', e.target.value)} />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="text-xs text-slate-500 block mb-1">Account Holder</label>
                                        <input type="text" placeholder="Name" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                                            value={account.account_holder_name} onChange={e => handleBankChange(index, 'account_holder_name', e.target.value)} />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="text-xs text-slate-500 block mb-1">Account Number</label>
                                        <input type="text" placeholder="0000..." className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm font-mono"
                                            value={account.account_number} onChange={e => handleBankChange(index, 'account_number', e.target.value)} />
                                    </div>
                                    <div className="lg:col-span-1">
                                        <label className="text-xs text-slate-500 block mb-1">IFSC Code</label>
                                        <input type="text" placeholder="IFSC..." className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white text-sm font-mono uppercase"
                                            value={account.ifsc_code} onChange={e => handleBankChange(index, 'ifsc_code', e.target.value)} />
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={() => handleRemoveBankAccount(index)} className="p-2 text-red-400 hover:bg-slate-700 rounded transition"><FiTrash2 /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={saveBankSettings}
                                disabled={savingBanks}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {savingBanks ? 'Saving...' : <><FiSave /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* App Versions Tab */}
            {activeTab === 'versions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Version History</h3>
                        <button onClick={() => setIsVersionModalOpen(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                            <FiPlus /> New Version
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-slate-950/50 uppercase text-xs font-semibold tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Version</th>
                                    <th className="px-6 py-4">Build</th>
                                    <th className="px-6 py-4">Platform</th>
                                    <th className="px-6 py-4">Mandatory</th>
                                    <th className="px-6 py-4">URL</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {versions.map(v => (
                                    <tr key={v.id}>
                                        <td className="px-6 py-4 text-white font-mono">{v.version}</td>
                                        <td className="px-6 py-4 text-slate-400 font-mono">{v.build_number}</td>
                                        <td className="px-6 py-4 capitalize">{v.platform}</td>
                                        <td className="px-6 py-4">
                                            {v.force_update ? <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs">Yes</span> : <span className="text-slate-500">No</span>}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-blue-400 truncate max-w-xs">{v.download_url}</td>
                                        <td className="px-6 py-4">{new Date(v.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* New Version Modal */}
                    <AnimatePresence>
                        {isVersionModalOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-xl">
                                    <h3 className="text-xl font-bold text-white mb-4">Release New Version</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-slate-400 text-sm mb-1">Version (e.g. 1.0.2)</label>
                                                <input type="text" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                                                    value={newVersion.version} onChange={e => setNewVersion({ ...newVersion, version: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-sm mb-1">Build Number</label>
                                                <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                                                    value={newVersion.build_number} onChange={e => setNewVersion({ ...newVersion, build_number: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-1">Platform</label>
                                            <select className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                                                value={newVersion.platform} onChange={e => setNewVersion({ ...newVersion, platform: e.target.value })}>
                                                <option value="android">Android</option>
                                                <option value="ios">iOS</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-sm mb-1">Download URL</label>
                                            <input type="text" placeholder="https://..." className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white"
                                                value={newVersion.download_url} onChange={e => setNewVersion({ ...newVersion, download_url: e.target.value })} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="mandatory" checked={newVersion.force_update} onChange={e => setNewVersion({ ...newVersion, force_update: e.target.checked })} />
                                            <label htmlFor="mandatory" className="text-slate-300 text-sm">Force Update (Mandatory)</label>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-6">
                                            <button onClick={() => setIsVersionModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700">Cancel</button>
                                            <button onClick={handleCreateVersion} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold">Release</button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default AppSettings;
