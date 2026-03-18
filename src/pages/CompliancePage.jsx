import React from 'react';
import ComplianceDashboard from '../components/ComplianceDashboard';

const CompliancePage = () => {
    return (
        <div className="min-h-screen bg-dark py-8">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 px-6 py-8 mb-8">
                <h1 className="text-3xl font-bold text-white">Compliance Dashboard</h1>
                <p className="text-gray-300 mt-2">Monitor user activities, KYC status, and transactions</p>
            </div>
            <div className="max-w-6xl mx-auto px-4">
                <ComplianceDashboard />
            </div>
        </div>
    );
};

export default CompliancePage;
