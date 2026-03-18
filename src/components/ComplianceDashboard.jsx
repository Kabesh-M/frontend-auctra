import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ComplianceDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchDashboardData();
        fetchComplianceLogs();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/compliance/dashboard', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDashboard(response.data.dashboard);
        } catch (error) {
            toast.error('Failed to fetch compliance dashboard');
        }
    };

    const fetchComplianceLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/compliance/logs?page=${page}&limit=20`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLogs(response.data.logs);
        } catch (error) {
            toast.error('Failed to fetch compliance logs');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComplianceLogs();
    }, [page]);

    if (!dashboard) {
        return <div className="text-center text-gray-400 py-8">Loading compliance data...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900 border border-blue-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Users</p>
                            <p className="text-2xl font-bold text-white">{dashboard.users.total}</p>
                        </div>
                        <Users className="text-blue-400" size={32} />
                    </div>
                    <p className="text-xs text-green-400 mt-2">✓ {dashboard.users.kycVerified} KYC Verified</p>
                </div>

                <div className="p-4 bg-gray-900 border border-purple-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Transactions</p>
                            <p className="text-2xl font-bold text-white">{dashboard.transactions.total}</p>
                        </div>
                        <TrendingUp className="text-purple-400" size={32} />
                    </div>
                    <p className="text-xs text-green-400 mt-2">₹{(dashboard.transactions.totalAmount / 100000).toFixed(1)}L</p>
                </div>

                <div className="p-4 bg-gray-900 border border-yellow-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Flagged Items</p>
                            <p className="text-2xl font-bold text-white">{dashboard.transactions.flagged}</p>
                        </div>
                        <AlertCircle className="text-yellow-400" size={32} />
                    </div>
                    <p className="text-xs text-yellow-400 mt-2">Pending Review</p>
                </div>

                <div className="p-4 bg-gray-900 border border-green-500 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">KYC Approved</p>
                            <p className="text-2xl font-bold text-white">{dashboard.kyc.approved}</p>
                        </div>
                        <CheckCircle className="text-green-400" size={32} />
                    </div>
                    <p className="text-xs text-green-400 mt-2">Fully Verified</p>
                </div>
            </div>

            {/* KYC Status Overview */}
            <div className="p-6 bg-gray-900 border border-blue-500 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">KYC Status Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-400">{dashboard.kyc.pending}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Approved</p>
                        <p className="text-3xl font-bold text-green-400">{dashboard.kyc.approved}</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 text-sm mb-1">Rejected</p>
                        <p className="text-3xl font-bold text-red-400">{dashboard.kyc.rejected}</p>
                    </div>
                </div>
            </div>

            {/* Recent Compliance Logs */}
            <div className="p-6 bg-gray-900 border border-blue-500 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Compliance Logs</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {loading ? (
                        <p className="text-gray-400">Loading logs...</p>
                    ) : logs.length === 0 ? (
                        <p className="text-gray-400">No logs found</p>
                    ) : (
                        logs.map(log => (
                            <div
                                key={log._id}
                                className={`p-3 rounded-lg border text-sm ${
                                    log.flaggedAsAnomalous
                                        ? 'bg-red-950 border-red-700'
                                        : 'bg-gray-800 border-gray-700'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`font-semibold ${
                                            log.flaggedAsAnomalous ? 'text-red-400' : 'text-blue-400'
                                        }`}>
                                            {log.action.toUpperCase()}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            User: {log.user?.email || 'Unknown'}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                        log.status === 'success'
                                            ? 'bg-green-900 text-green-400'
                                            : log.status === 'failed'
                                            ? 'bg-red-900 text-red-400'
                                            : 'bg-yellow-900 text-yellow-400'
                                    }`}>
                                        {log.status}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">
                                    {new Date(log.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition text-sm"
                    >
                        Previous
                    </button>
                    <span className="text-gray-400 flex items-center px-4">Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition text-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplianceDashboard;
