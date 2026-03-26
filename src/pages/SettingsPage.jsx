import React, { useState } from 'react';
import { User, Lock, Bell, Shield, LogOut } from 'lucide-react';
import SecuritySettings from '../components/SecuritySettings';
import TwoFactorSetup from '../components/TwoFactorSetup';
import NotificationCenter from '../components/NotificationCenter';
import apiClient from '../config/api';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('security');
    const [userInfo, setUserInfo] = useState(null);

    React.useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await apiClient.get('/api/auth/profile');
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-dark settings-shell">
            <div className="page-hero max-w-7xl mx-auto px-6">
                <span className="badge badge-primary">Account Center</span>
                <h1 className="page-title">Settings & Security</h1>
                <p className="page-subtitle">Manage authentication, privacy, alerts, and account profile from one secure place.</p>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="settings-tabs">
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`settings-tab-btn ${
                            activeTab === 'security'
                                ? 'active'
                                : ''
                        }`}
                    >
                        <Lock size={20} />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('2fa')}
                        className={`settings-tab-btn ${
                            activeTab === '2fa'
                                ? 'active'
                                : ''
                        }`}
                    >
                        <Shield size={20} />
                        Two-Factor Auth
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`settings-tab-btn ${
                            activeTab === 'notifications'
                                ? 'active'
                                : ''
                        }`}
                    >
                        <Bell size={20} />
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`settings-tab-btn ${
                            activeTab === 'profile'
                                ? 'active'
                                : ''
                        }`}
                    >
                        <User size={20} />
                        Profile
                    </button>
                </div>

                {activeTab === 'security' && <SecuritySettings onOpenTwoFactor={() => setActiveTab('2fa')} />}
                {activeTab === '2fa' && <TwoFactorSetup onSetupComplete={() => setActiveTab('security')} />}
                {activeTab === 'notifications' && <NotificationCenter />}

                {activeTab === 'profile' && userInfo && (
                    <div className="glass settings-profile-card">
                        <h2 className="text-2xl font-black text-main mb-6">Profile Information</h2>
                        <div className="space-y-4">
                            <div className="settings-profile-row">
                                <p className="settings-profile-label">Email</p>
                                <p className="settings-profile-value">{userInfo.email}</p>
                            </div>
                            <div className="settings-profile-row">
                                <p className="settings-profile-label">Phone</p>
                                <p className="settings-profile-value">{userInfo.mobile}</p>
                            </div>
                            <div className="settings-profile-row">
                                <p className="settings-profile-label">Role</p>
                                <p className="settings-profile-value capitalize">{userInfo.role}</p>
                            </div>
                            <div className="settings-profile-row">
                                <p className="settings-profile-label">Account Status</p>
                                <p className={`settings-profile-value capitalize ${
                                    userInfo.status === 'active' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {userInfo.status}
                                </p>
                            </div>
                            <div className="settings-profile-row">
                                <p className="settings-profile-label">Member Since</p>
                                <p className="settings-profile-value">
                                    {new Date(userInfo.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <hr style={{ borderColor: 'var(--glass-border)' }} />

                            <button
                                onClick={handleLogout}
                                className="app-logout-btn w-full" style={{ justifyContent: 'center', marginTop: '1.25rem' }}
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
