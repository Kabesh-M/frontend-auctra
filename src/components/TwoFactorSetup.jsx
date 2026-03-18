import React, { useState } from 'react';
import { CheckCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../config/api';

const TwoFactorSetup = ({ onSetupComplete }) => {
    const [step, setStep] = useState(1);
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCodes, setShowCodes] = useState(false);

    const handleSetup = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post('/api/auth/2fa/setup', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setQrCode(response.data.qrCode);
            setSecret(response.data.secret);
            setBackupCodes(response.data.backupCodes);
            setStep(2);
            toast.success('QR Code generated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to setup 2FA');
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (!token || token.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/api/auth/2fa/verify', { token }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('2FA enabled successfully!');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        }
        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const downloadBackupCodes = () => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(backupCodes.join('\n')));
        element.setAttribute('download', 'backup-codes.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="glass settings-card" style={{ maxWidth: '34rem' }}>
            <h2 className="text-2xl font-black text-main mb-6">Setup Two-Factor Authentication</h2>

            {step === 1 && (
                <div className="space-y-4">
                    <p className="text-muted">
                        Two-factor authentication adds an extra layer of security to your account.
                    </p>
                    <button
                        onClick={handleSetup}
                        disabled={loading}
                        className="btn-primary w-full py-3"
                    >
                        {loading ? 'Setting up...' : 'Start Setup'}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-muted mb-4">Scan this QR code with your authenticator app:</p>
                        {qrCode && (
                            <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" style={{ border: '1px solid var(--glass-border)', borderRadius: '0.75rem', padding: '0.5rem', background: '#fff' }} />
                        )}
                    </div>

                    <div className="settings-section">
                        <p className="text-sm text-muted mb-2">Or enter this key manually:</p>
                        <div className="flex items-center justify-between">
                            <code className="text-success font-mono text-sm">{secret}</code>
                            <button
                                onClick={() => copyToClipboard(secret)}
                                className="btn-secondary" style={{ padding: '0.45rem 0.55rem' }}
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={token}
                                onChange={(e) => setToken(e.target.value.slice(0, 6))}
                                maxLength="6"
                                className="input-field"
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading}
                        className="btn-primary w-full py-3"
                    >
                        {loading ? 'Verifying...' : 'Verify & Enable 2FA'}
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-center">
                        <CheckCircle size={48} className="text-success" />
                    </div>
                    <p className="text-center text-main font-semibold">2FA Setup Complete!</p>

                    <div className="kyc-note-box">
                        <p className="text-sm mb-3">Save these backup codes in a safe place:</p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                            {backupCodes.map((code, idx) => (
                                <code key={idx} className="glass" style={{ padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', display: 'inline-block', textAlign: 'center' }}>
                                    {code}
                                </code>
                            ))}
                        </div>
                        <button
                            onClick={downloadBackupCodes}
                            className="btn-secondary w-full py-3 text-sm"
                        >
                            Download Backup Codes
                        </button>
                    </div>

                    <button
                        onClick={onSetupComplete}
                        className="btn-primary w-full py-3"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
};

export default TwoFactorSetup;
