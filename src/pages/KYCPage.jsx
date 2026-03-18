import React from 'react';
import KYCForm from '../components/KYCForm';

const KYCPage = () => {
    return (
        <div className="min-h-screen bg-dark kyc-shell">
            <div className="page-hero max-w-7xl mx-auto px-6">
                <span className="badge badge-primary">Compliance Required</span>
                <h1 className="page-title">Know Your Customer Verification</h1>
                <p className="page-subtitle">Complete identity and banking verification to unlock secure bidding, withdrawals, and full platform access.</p>
            </div>

            <div className="max-w-4xl mx-auto px-4" style={{ paddingBottom: '2.5rem' }}>
                <KYCForm onSubmitComplete={() => window.location.href = '/dashboard'} />
            </div>
        </div>
    );
};

export default KYCPage;
