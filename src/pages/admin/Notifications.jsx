import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiSearch, FiFilter, FiBell, FiCheck, FiInfo, FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        filterNotifications();
    }, [searchTerm, typeFilter, notifications]);

    const fetchNotifications = async () => {
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
            setFilteredNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterNotifications = () => {
        let temp = [...notifications];

        // Search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            temp = temp.filter(n =>
                (n.title?.toLowerCase() || '').includes(lowerSearch) ||
                (n.message?.toLowerCase() || '').includes(lowerSearch)
            );
        }

        // Filter
        if (typeFilter !== 'all') {
            temp = temp.filter(n => n.type === typeFilter);
        }

        setFilteredNotifications(temp);
    };

    // Helper for type styling
    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    <p className="text-slate-400 mt-1">View system and user notifications.</p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            className="bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                    </select>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 uppercase text-xs font-semibold tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Read Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">Loading notifications...</td></tr>
                            ) : filteredNotifications.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No notifications found.</td></tr>
                            ) : (
                                filteredNotifications.map(notification => (
                                    <tr key={notification.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white">
                                            {notification.title || 'Untitled'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-xs truncate" title={notification.message}>
                                                {notification.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getTypeStyles(notification.type)}`}>
                                                {notification.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {notification.is_read ? (
                                                <span className="text-green-400 flex items-center justify-end gap-1">
                                                    <FiCheck /> Read
                                                </span>
                                            ) : (
                                                <span className="text-blue-400 flex items-center justify-end gap-1">
                                                    <FiInfo /> Unread
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
                    <span>Showing {filteredNotifications.length} notifications</span>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
