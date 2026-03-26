import React, { useEffect, useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('all');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('limit', 10);
            if (filter !== 'all') params.append('status', filter);

            const response = await apiClient.get(`/api/transactions/history?${params}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTransactions(response.data.transactions);
        } catch (error) {
            toast.error('Failed to fetch transactions');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, filter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'text-green-400';
            case 'pending':
                return 'text-yellow-400';
            case 'failed':
                return 'text-red-400';
            case 'cancelled':
                return 'text-gray-400';
            default:
                return 'text-blue-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle size={16} />;
            case 'pending':
                return <Clock size={16} />;
            case 'failed':
                return <XCircle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getTransactionIcon = (type) => {
        return type === 'deposit' || type === 'chit_payout' ? (
            <ArrowDownLeft className="text-green-400" size={20} />
        ) : (
            <ArrowUpRight className="text-red-400" size={20} />
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg border border-blue-500">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CreditCard size={28} />
                Transaction History
            </h2>

            <div className="flex gap-2 mb-4 flex-wrap">
                {['all', 'completed', 'pending', 'failed'].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilter(status); setPage(1); }}
                        className={`px-4 py-2 rounded-lg transition capitalize text-sm ${
                            filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {status === 'all' ? 'All Transactions' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {loading ? (
                    <p className="text-gray-400 text-center py-8">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No transactions found</p>
                ) : (
                    transactions.map(transaction => (
                        <div
                            key={transaction._id}
                            className="p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="p-2 bg-gray-700 rounded-lg">
                                        {getTransactionIcon(transaction.type)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white capitalize">
                                            {transaction.type.replace('_', ' ')}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            ID: {transaction.transactionId}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${
                                        transaction.type === 'deposit' || transaction.type === 'chit_payout'
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    }`}>
                                        {transaction.type === 'deposit' || transaction.type === 'chit_payout' ? '+' : '-'}₹{transaction.amount}
                                    </p>
                                    <div className={`flex items-center gap-1 text-sm ${getStatusColor(transaction.status)}`}>
                                        {getStatusIcon(transaction.status)}
                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 flex justify-between">
                                <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                                <span className="text-blue-400">{transaction.paymentGateway}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!loading && transactions.length > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition text-sm"
                    >
                        Previous
                    </button>
                    <span className="text-gray-400 flex items-center px-4">Page {page}</span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
