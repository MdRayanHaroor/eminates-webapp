import React from 'react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-white">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total Investors</h3>
                    <p className="text-2xl font-bold text-white mt-2">Loading...</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Active Requests</h3>
                    <p className="text-2xl font-bold text-yellow-500 mt-2">Loading...</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium uppercase">Total Investments</h3>
                    <p className="text-2xl font-bold text-green-500 mt-2">Loading...</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
