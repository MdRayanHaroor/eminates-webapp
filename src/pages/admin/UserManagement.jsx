import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false }); // Assuming created_at exists, else remove sort

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">User Management</h1>
            <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-700 text-gray-200 uppercase text-sm">
                            <tr>
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Phone</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4">No users found</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                                    <td className="py-3 px-4 text-white font-medium">{user.full_name || 'N/A'}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${user.role === 'admin' ? 'bg-red-500/10 border-red-500/50 text-red-500' :
                                                user.role === 'agent' ? 'bg-purple-500/10 border-purple-500/50 text-purple-500' :
                                                    'bg-green-500/10 border-green-500/50 text-green-500'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{user.phone || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
