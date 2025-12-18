import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { FiSearch, FiFilter, FiMoreVertical, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, roleFilter, users]);

    const fetchUsers = async () => {
        try {
            // Fetch users with their latest investment request if needed, but for now just raw user data
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
            setFilteredUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let temp = [...users];

        // Search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            temp = temp.filter(u =>
                (u.full_name?.toLowerCase() || '').includes(lowerSearch) ||
                (u.email?.toLowerCase() || '').includes(lowerSearch) ||
                (u.phone?.toLowerCase() || '').includes(lowerSearch)
            );
        }

        // Filter
        if (roleFilter !== 'all') {
            temp = temp.filter(u => u.role === roleFilter);
        }

        setFilteredUsers(temp);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400 mt-1">Manage and view all registered users.</p>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Investor</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-950/50 uppercase text-xs font-semibold tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4">User Info</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No users found matching your search.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold border border-slate-700 group-hover:border-slate-600 transition-colors">
                                                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{user.full_name || 'Unknown User'}</div>
                                                    <div className="text-xs text-slate-500">ID: {user.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-300">{user.email}</div>
                                            <div className="text-xs text-slate-500">{user.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                                                ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    user.role === 'agent' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/admin/users/${user.id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs text-slate-500">
                    <span>Showing {filteredUsers.length} users</span>
                    {/* Pagination buttons can go here */}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
