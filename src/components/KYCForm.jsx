import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const KYCForm = ({ onSubmitComplete }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [kycStatus, setKycStatus] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        nationality: 'India',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        documentType: 'aadhar',
        documentNumber: '',
        documentExpiry: '',
        bankAccountNumber: '',
        bankIfscCode: '',
        bankName: '',
        accountHolderName: '',
        accountType: 'savings'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fetchKYCStatus = async () => {
        try {
            const response = await apiClient.get('/api/kyc/status', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setKycStatus(response.data);
        } catch (error) {
            console.error('Error fetching KYC status:', error);
        }
    };

    React.useEffect(() => {
        fetchKYCStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient.post('/api/kyc/submit', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('KYC submitted successfully!');
            setStep(3);
            fetchKYCStatus();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit KYC');
        }
        setLoading(false);
    };

    const renderStatusCard = ({ icon: Icon, title, titleClass, borderClass, message, subMessage, action }) => (
        <div className={`glass kyc-status-card ${borderClass}`}>
            <div className="flex items-center justify-center mb-4">
                <Icon size={46} className={titleClass} />
            </div>
            <h2 className={`text-2xl font-black text-center mb-2 ${titleClass}`}>{title}</h2>
            <p className="text-center text-muted">{message}</p>
            {subMessage && <p className="text-center text-dim text-sm mt-2">{subMessage}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );

    if (kycStatus?.status === 'approved') {
        return renderStatusCard({
            icon: CheckCircle,
            title: 'KYC Verified',
            titleClass: 'text-success',
            borderClass: 'kyc-status-approved',
            message: 'Your identity verification has been approved. Full platform access is now enabled.',
            subMessage: `Approved on: ${new Date(kycStatus.kyc.approvalDate).toLocaleDateString()}`
        });
    }

    if (kycStatus?.status === 'under_review' || kycStatus?.status === 'submitted') {
        return renderStatusCard({
            icon: Clock,
            title: 'KYC Under Review',
            titleClass: 'text-warning',
            borderClass: 'kyc-status-review',
            message: 'Your KYC is currently being reviewed by our compliance team.',
            subMessage: `Submitted on: ${new Date(kycStatus.kyc.submittedAt).toLocaleDateString()}`
        });
    }

    if (kycStatus?.status === 'rejected') {
        return renderStatusCard({
            icon: AlertCircle,
            title: 'KYC Rejected',
            titleClass: 'text-error',
            borderClass: 'kyc-status-rejected',
            message: 'Your previous KYC submission was not approved.',
            action: (
                <>
                    {kycStatus.kyc.rejectionReason && (
                        <div className="kyc-reason-box mb-4">
                            <p className="text-sm"><strong>Reason:</strong> {kycStatus.kyc.rejectionReason}</p>
                        </div>
                    )}
                    <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Resubmit KYC</button>
                </>
            )
        });
    }

    return (
        <div className="glass kyc-form-card">
            <div className="kyc-header">
                <h2 className="text-2xl font-black text-main tracking-tight">Complete Your KYC Verification</h2>
                <p className="text-muted text-sm mt-1">Provide personal, document, and bank details for verification.</p>
            </div>

            <div className="kyc-stepper">
                <div className={`kyc-step ${step >= 1 ? 'active' : ''}`}>1. Personal & Documents</div>
                <div className={`kyc-step ${step >= 2 ? 'active' : ''}`}>2. Bank Details</div>
                <div className={`kyc-step ${step >= 3 ? 'active' : ''}`}>3. Confirmation</div>
            </div>

            {step === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                    {/* Personal Information */}
                    <div className="kyc-section">
                        <h3 className="kyc-section-title">Personal Information</h3>
                        <div className="kyc-grid-2">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </div>
                        <div className="kyc-grid-2" style={{ marginTop: '1rem' }}>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Document Information */}
                    <div className="kyc-section">
                        <h3 className="kyc-section-title">Document Information</h3>
                        <div className="kyc-grid-2">
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            >
                                <option value="aadhar">Aadhar Card</option>
                                <option value="passport">Passport</option>
                                <option value="driver_license">Driver License</option>
                                <option value="pan">PAN Card</option>
                            </select>
                            <input
                                type="text"
                                name="documentNumber"
                                placeholder="Document Number"
                                value={formData.documentNumber}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </div>
                        <input
                            type="date"
                            name="documentExpiry"
                            placeholder="Document Expiry"
                            value={formData.documentExpiry}
                            onChange={handleInputChange}
                            required
                            className="input-field"
                            style={{ marginTop: '1rem' }}
                        />
                    </div>

                    {/* Address Information */}
                    <div className="kyc-section">
                        <h3 className="kyc-section-title">Address</h3>
                        <input
                            type="text"
                            name="addressLine1"
                            placeholder="Address Line 1"
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            required
                            className="input-field"
                        />
                        <input
                            type="text"
                            name="addressLine2"
                            placeholder="Address Line 2 (Optional)"
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            className="input-field"
                            style={{ marginTop: '0.75rem' }}
                        />
                        <div className="kyc-grid-3" style={{ marginTop: '1rem' }}>
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                            <input
                                type="text"
                                name="postalCode"
                                placeholder="Postal Code"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                required
                                className="input-field"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3"
                    >
                        Continue to Bank Details
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="kyc-section-title">Bank Account Information</h3>
                    <input
                        type="text"
                        name="accountHolderName"
                        placeholder="Account Holder Name"
                        value={formData.accountHolderName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        name="bankName"
                        placeholder="Bank Name"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                    />
                    <div className="kyc-grid-2">
                        <input
                            type="text"
                            name="bankIfscCode"
                            placeholder="IFSC Code"
                            value={formData.bankIfscCode}
                            onChange={handleInputChange}
                            required
                            className="input-field"
                        />
                        <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleInputChange}
                            required
                            className="input-field"
                        >
                            <option value="savings">Savings</option>
                            <option value="current">Current</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        name="bankAccountNumber"
                        placeholder="Account Number"
                        value={formData.bankAccountNumber}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                    />

                    <div className="kyc-note-box">
                        Your bank details will be encrypted and securely stored. They are used only for verified withdrawals.
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="btn-secondary flex-1 py-3"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 py-3"
                        >
                            {loading ? 'Submitting...' : 'Submit KYC'}
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <div className="text-center">
                    <CheckCircle size={48} className="mx-auto mb-4 text-success" />
                    <h3 className="text-xl font-semibold text-success mb-2">KYC Submitted Successfully</h3>
                    <p className="text-muted mb-4">Our compliance team will review your submission within 24–48 hours.</p>
                    <button
                        onClick={onSubmitComplete}
                        className="btn-primary py-3 px-6"
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default KYCForm;
