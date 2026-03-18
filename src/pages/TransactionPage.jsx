import React from 'react';
import TransactionHistory from '../components/TransactionHistory';

const TransactionPage = () => {
    return (
        <div className="min-h-screen bg-dark py-8">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-8 mb-8">
                <h1 className="text-3xl font-bold text-white">Transaction History</h1>
                <p className="text-gray-300 mt-2">View and manage all your transactions</p>
            </div>
            <div className="max-w-4xl mx-auto px-4">
                <TransactionHistory />
            </div>
        </div>
    );
};

export default TransactionPage;
