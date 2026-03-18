import React, { useState, useEffect } from 'react';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SecuritySettings = ({ onOpenTwoFactor }) => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetch2FAStatus();
    }, []);

    const fetch2FAStatus = async () => {
        try {
            const response = await axios.get('/api/auth/2fa/status', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTwoFactorEnabled(response.data.isEnabled);
        } catch (error) {
            console.error('Error fetching 2FA status:', error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            // This endpoint should be created in the backend
            await axios.post('/api/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
        setLoading(false);
    };

    const disable2FA = async () => {
        if (!window.confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) {
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/auth/2fa/disable', 
                { password: prompt('Enter your password to confirm:') },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            toast.success('2FA disabled');
            setTwoFactorEnabled(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to disable 2FA');
        }
        setLoading(false);
    };

    return (
        <div className="glass settings-card">
            <h2 className="text-2xl font-black text-main mb-6 flex items-center gap-2">
                <Shield size={28} />
                Security Settings
            </h2>

            {/* Two-Factor Authentication */}
            <div className="settings-section">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-main">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted mt-1">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <div className={`badge ${
                        twoFactorEnabled
                            ? 'badge-success'
                            : 'badge-error'
                    }`}>
                        {twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                    </div>
                </div>
                {!twoFactorEnabled && (
                    <button
                        className="btn-primary mt-4 px-4 py-2 text-sm"
                        onClick={() => onOpenTwoFactor?.()}
                    >
                        Enable 2FA
                    </button>
                )}
                {twoFactorEnabled && (
                    <button
                        onClick={disable2FA}
                        disabled={loading}
                        className="app-logout-btn mt-4"
                    >
                        Disable 2FA
                    </button>
                )}
            </div>

            {/* Change Password */}
            <div className="settings-section">
                <h3 className="font-semibold text-main mb-4 flex items-center gap-2">
                    <Lock size={20} />
                    Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                required
                                className="input-field input-with-affix"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="input-affix-btn"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-2">New Password</label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            required
                            className="input-field"
                            placeholder="Enter new password"
                        />
                        <p className="text-xs text-dim mt-1">
                            At least 8 characters with uppercase, lowercase, numbers and special characters
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm text-muted mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            required
                            className="input-field"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            <div className="mt-6 kyc-note-box">
                <p className="text-sm">
                    <strong>Security Tips:</strong> Use a strong, unique password. Enable 2FA for additional protection. Never share your credentials.
                </p>
            </div>
        </div>
    );
};

export default SecuritySettings;
