import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiSend, FiInfo, FiAlertCircle, FiX, FiSearch, FiCheck } from 'react-icons/fi';

const SendNotification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [targetRole, setTargetRole] = useState('all'); // 'all', 'user', 'investor', 'agent', 'admin', 'specific'
    const [channels, setChannels] = useState({
        inApp: true,
        push: false,
        email: false
    });
    const [loading, setLoading] = useState(false);
    const [statusLabel, setStatusLabel] = useState(null);

    // Specific User Targeting State
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Clear status after 5 seconds
    useEffect(() => {
        if (statusLabel) {
            const timer = setTimeout(() => setStatusLabel(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [statusLabel]);

    // Search Users Debounce effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (userSearchTerm.length >= 2 && targetRole === 'specific') {
                searchUsers();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [userSearchTerm, targetRole]);

    const searchUsers = async () => {
        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name, email, role')
                .or(`full_name.ilike.%${userSearchTerm}%,email.ilike.%${userSearchTerm}%`)
                .limit(5);

            if (error) throw error;
            setSearchResults(data || []);
        } catch (error) {
            console.error('Error searching users:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleChannelChange = (channel) => {
        setChannels(prev => ({
            ...prev,
            [channel]: !prev[channel]
        }));
    };

    const toggleUserSelection = (user) => {
        if (selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers(prev => [...prev, user]);
        }
        setUserSearchTerm(''); // Clear search after selection for better UX
        setSearchResults([]);
    };

    const removeUser = (userId) => {
        setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusLabel({ type: 'info', text: 'Sending notification...' });

        try {
            // Determine effective channels
            const sendInApp = channels.inApp;
            const sendPush = channels.push;
            const sendEmail = channels.email;

            if (!sendInApp && !sendPush && !sendEmail) {
                setStatusLabel({ type: 'warning', text: 'Please select at least one delivery channel.' });
                setLoading(false);
                return;
            }

            // 1. Identify Target Users
            let targetUserIds = [];
            if (targetRole === 'specific') {
                targetUserIds = selectedUsers.map(u => u.id);
            } else {
                let query = supabase.from('users').select('id');
                if (targetRole !== 'all') {
                    query = query.eq('role', targetRole);
                }
                const { data: users, error: userError } = await query;
                if (userError) throw new Error('Error fetching target users');
                targetUserIds = users.map(u => u.id);
            }

            if (targetUserIds.length === 0) {
                setStatusLabel({ type: 'warning', text: 'No users found for the selected targeting.' });
                setLoading(false);
                return;
            }

            // 2. Handle In-App / Push (via DB Insert which triggers send-fcm)
            if (sendInApp || sendPush) {
                const notificationsToInsert = targetUserIds.map(userId => ({
                    user_id: userId,
                    title,
                    message,
                    type,
                    is_read: false,
                    created_at: new Date().toISOString()
                }));

                const { error: insertError } = await supabase
                    .from('notifications')
                    .insert(notificationsToInsert);

                if (insertError) throw insertError;
            }

            // 3. Handle Email (via Direct SMTP Function)
            if (sendEmail) {
                const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email-smtp', {
                    body: {
                        user_ids: targetUserIds,
                        title,
                        message,
                        html_body: `<p>${message}</p>` // Simple wrapper
                    }
                });

                if (emailError) {
                    console.error('SMTP Function Connection Error:', emailError);
                    setStatusLabel({ type: 'error', text: `Connection failed: ${emailError.message}` });
                    setLoading(false);
                    return;
                }

                // Check for logical error returned in 200 OK response
                if (emailData && emailData.error) {
                    console.error('SMTP Logic Error:', emailData.error);
                    setStatusLabel({ type: 'warning', text: `Email failed: ${emailData.error}` });
                    setLoading(false);
                    return;
                }

                console.log('SMTP Result:', emailData);
            }

            setStatusLabel({ type: 'success', text: `Successfully processed for ${targetUserIds.length} users.` });

            // Reset form
            setTitle('');
            setMessage('');
            setType('info');
            if (targetRole === 'specific') setSelectedUsers([]);

        } catch (error) {
            console.error('Error sending notification:', error);
            setStatusLabel({ type: 'error', text: error.message || 'Failed to send notification' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Notify Users</h1>
                <p className="text-gray-500 mt-1">Send notifications to users via multiple channels.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
                <form onSubmit={handleSend} className="space-y-6">

                    {/* Status Label */}
                    {statusLabel && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-medium
                            ${statusLabel.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                            ${statusLabel.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                            ${statusLabel.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : ''}
                            ${statusLabel.type === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' : ''}
                        `}>
                            {statusLabel.type === 'success' && <FiInfo className="text-lg" />}
                            {statusLabel.type === 'error' && <FiAlertCircle className="text-lg" />}
                            {statusLabel.type === 'warning' && <FiAlertCircle className="text-lg" />}
                            {statusLabel.type === 'info' && <FiInfo className="text-lg" />}
                            {statusLabel.text}
                        </div>
                    )}

                    {/* Title & Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="sm:col-span-2 space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Notification Heading"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                            >
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Message</label>
                        <textarea
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                        />
                    </div>

                    {/* Targeting */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Target Audience</label>
                        <select
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm bg-white"
                        >
                            <option value="all">All Users</option>
                            <option value="user">Regular Users</option>
                            <option value="investor">Investors</option>
                            <option value="agent">Agents</option>
                            <option value="admin">Admins</option>
                            <option value="specific">Specific Users</option>
                        </select>
                    </div>

                    {/* Specific User Search & Chips */}
                    {targetRole === 'specific' && (
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            {/* Selected Chips */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedUsers.map(user => (
                                    <div key={user.id} className="flex items-center gap-1 bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                        <span>{user.full_name || user.email}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeUser(user.id)}
                                            className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-gray-100"
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </div>
                                ))}
                                {selectedUsers.length === 0 && (
                                    <span className="text-xs text-gray-400 italic py-1">No users selected yet</span>
                                )}
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={userSearchTerm}
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                                />
                                {isSearching && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Searching...</div>}
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                                    {searchResults.map(user => {
                                        const isSelected = selectedUsers.some(u => u.id === user.id);
                                        return (
                                            <div
                                                key={user.id}
                                                onClick={() => toggleUserSelection(user)}
                                                className={`px-4 py-2 cursor-pointer text-sm flex justify-between items-center hover:bg-gray-50 ${isSelected ? 'bg-blue-50/50' : ''}`}
                                            >
                                                <div>
                                                    <div className="font-medium text-gray-800">{user.full_name || 'No Name'}</div>
                                                    <div className="text-xs text-gray-500">{user.email} - <span className="capitalize">{user.role}</span></div>
                                                </div>
                                                {isSelected && <FiCheck className="text-blue-600" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Channels */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">Delivery Channels</label>
                        <div className="flex flex-wrap gap-4">
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${channels.inApp ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="checkbox"
                                    checked={channels.inApp}
                                    onChange={() => handleChannelChange('inApp')}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700 font-medium flex items-center gap-2">
                                    <FiInfo className="text-blue-500" /> In-App
                                </span>
                            </label>
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${channels.push ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="checkbox"
                                    checked={channels.push}
                                    onChange={() => handleChannelChange('push')}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700 font-medium flex items-center gap-2">
                                    <FiAlertCircle className="text-purple-500" /> Push
                                </span>
                            </label>
                            <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${channels.email ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                <input
                                    type="checkbox"
                                    checked={channels.email}
                                    onChange={() => handleChannelChange('email')}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-sm text-gray-700 font-medium flex items-center gap-2">
                                    <FiSend className="text-green-500" /> Email
                                </span>
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">
                            * Push and Email notifications are simulated.
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || (!channels.inApp && !channels.push && !channels.email)}
                            className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold transition-all ${(loading || (!channels.inApp && !channels.push && !channels.email))
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {loading ? 'Sending...' : <><FiSend /> Send Notification</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendNotification;
