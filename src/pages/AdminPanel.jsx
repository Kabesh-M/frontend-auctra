import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../config/api';
import { useAuth } from '../context/authCore';
import { Shield, ShieldAlert, UserCheck, UserX, Activity, Search, RefreshCw, Smartphone, Mail, Building, CreditCard, Loader2, LayoutDashboard } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            try {
                const usersRes = await apiClient.get('/api/admin/users');
                setUsers(usersRes.data);
            } catch {
                console.error('Failed to fetch users');
                toast.error('Failed to load users');
            }

            try {
                const logsRes = await apiClient.get('/api/admin/logs');
                setAuditLogs(logsRes.data);
            } catch {
                console.error('Failed to fetch logs');
                // Logs failing is less critical, don't show error toast
            }
        } catch {
            toast.error('Access Denied or Server Error');
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (user?.token) {
            setTimeout(() => {
                fetchData();
            }, 0);
        }
    }, [user, fetchData]);

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            await apiClient.put(`/api/admin/users/${userId}/status`, { status: newStatus });
            toast.success(`User ${newStatus === 'blocked' ? 'Blocked' : 'Activated'}`);
            fetchData();
        } catch {
            toast.error('Action failed');
        }
    };

    const search = (searchTerm || '').toLowerCase();
    const filteredUsers = (users || []).filter(u => {
        if (!u) return false;
        const email = (u.email || '').toLowerCase();
        const mobile = u.mobile || '';
        const bankName = (u.bankName || '').toLowerCase();
        return email.includes(search) || mobile.includes(search) || bankName.includes(search);
    });

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <header className="glass p-6 border-b flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-2xl">
                        <Shield className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-main tracking-tighter uppercase mb-1">Admin Panel</h1>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-widest opacity-60">Manage Users & Activity</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" size={16} />
                        <input
                            placeholder="Search by email, phone, bank..."
                            className="input-field py-2 text-xs w-64"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchData} className="btn-secondary p-2.5">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest">
                        <LayoutDashboard size={16} /> Dashboard
                    </button>
                </div>
            </header>

            <div className="flex-grow p-10 max-w-7xl mx-auto w-full">
                <div className="flex gap-8 border-b mb-10" style={{ borderColor: 'var(--glass-border)' }}>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`pb-4 px-2 flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all`}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-dim)',
                            borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        <UserCheck size={16} /> All Users
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`pb-4 px-2 flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all`}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeTab === 'logs' ? 'var(--primary)' : 'var(--text-dim)',
                            borderBottom: activeTab === 'logs' ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        <Activity size={16} /> Activity Logs
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={40} className="text-primary animate-spin" />
                        <p className="text-muted text-sm font-bold uppercase tracking-widest">Loading data...</p>
                    </div>
                ) : activeTab === 'users' ? (
                    filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <UserX size={48} className="text-dim opacity-40" />
                            <p className="text-muted text-sm font-bold uppercase tracking-widest">No users found</p>
                        </div>
                    ) : (
                        <div className="glass overflow-hidden rounded-3xl">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b" style={{ borderColor: 'var(--glass-border)' }}>
                                        <th className="text-left p-6 uppercase tracking-widest text-[10px] text-muted">Email</th>
                                        <th className="text-left p-6 uppercase tracking-widest text-[10px] text-muted">Phone Number</th>
                                        <th className="text-left p-6 uppercase tracking-widest text-[10px] text-muted">Bank Details</th>
                                        <th className="text-left p-6 uppercase tracking-widest text-[10px] text-muted">Role & Status</th>
                                        <th className="text-right p-6 uppercase tracking-widest text-[10px] text-muted">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-white hover:bg-opacity-[0.02] transition-all border-b" style={{ borderColor: 'var(--glass-border)' }}>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 font-bold text-main text-sm">
                                                    <Mail size={14} className="text-primary" /> {u.email}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-main text-sm font-mono">
                                                    <Smartphone size={14} className="text-primary" /> {u.mobile || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {u.bankName && u.bankName !== 'Pending' ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 font-bold text-main text-[11px] uppercase tracking-tight">
                                                            <Building size={12} className="text-primary" /> {u.bankName}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-dim text-[10px] font-mono">
                                                            <CreditCard size={10} /> {u.bankAccount || 'N/A'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-dim italic text-[10px]">No Bank Details</span>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2 items-center">
                                                    <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>{u.role || 'participant'}</span>
                                                    <span className={`badge ${(u.status || 'active') === 'blocked' ? 'badge-error' : 'badge-success'}`}>
                                                        {(u.status || 'active').toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => toggleUserStatus(u._id, u.status || 'active')}
                                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-[10px] transition-all ${(u.status || 'active') === 'active' ? 'bg-error bg-opacity-10 text-error hover:bg-opacity-20' : 'bg-success bg-opacity-10 text-success hover:bg-opacity-20'}`}
                                                    style={{ marginLeft: 'auto' }}
                                                >
                                                    {(u.status || 'active') === 'active' ? <><UserX size={14} /> BLOCK</> : <><UserCheck size={14} /> ACTIVATE</>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    auditLogs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Activity size={48} className="text-dim opacity-40" />
                            <p className="text-muted text-sm font-bold uppercase tracking-widest">No activity logs yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {auditLogs.map((log) => (
                                <div key={log._id} className="glass p-4 rounded-2xl flex justify-between items-center border-l-4 border-primary">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-dark-secondary p-2 rounded-lg">
                                            <Activity size={16} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-main font-bold text-sm uppercase tracking-tight">{(log.action || '').replace('_', ' ')}</p>
                                            <p className="text-dim text-[10px] font-mono">{log.actor?.email || 'System'} | {log.ipDevice || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted text-[10px] font-bold">{new Date(log.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
