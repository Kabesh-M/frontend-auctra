import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Settings, FileText, TrendingUp, ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/authCore';
import AuctraLogo from './AuctraLogo';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/kyc', label: 'KYC Verification', icon: FileText },
        { path: '/transactions', label: 'Transactions', icon: TrendingUp },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const adminItems = [
        { path: '/compliance', label: 'Compliance', icon: ShieldAlert },
    ];

    const handleLogout = () => {
        logout();
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav className="app-navbar">
            <div className="app-navbar-inner">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <AuctraLogo showText={true} className="h-9" />
                </Link>

                    <div className="app-nav-links">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`app-nav-link ${
                                        isActive(item.path)
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            );
                        })}

                        {user?.role === 'admin' && (
                            adminItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`app-nav-link ${
                                            isActive(item.path)
                                                ? 'admin-active'
                                                : ''
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                );
                            })
                        )}
                    </div>

                    <div className="app-user-group">
                        <span className="app-user-pill">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="app-logout-btn"
                        >
                            <LogOut size={18} />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="app-mobile-toggle"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="app-mobile-panel space-y-2">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMenuOpen(false)}
                                    className={`app-nav-link block ${
                                        isActive(item.path)
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            );
                        })}

                        {user?.role === 'admin' && (
                            adminItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMenuOpen(false)}
                                        className={`app-nav-link block ${
                                            isActive(item.path)
                                                ? 'admin-active'
                                                : ''
                                        }`}
                                    >
                                        <Icon size={18} />
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                );
                            })
                        )}

                        <hr style={{ borderColor: 'var(--glass-border)' }} />

                        <div className="app-user-pill" style={{ padding: '0.5rem 0.4rem' }}>{user?.email}</div>

                        <button
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                            className="app-logout-btn w-full"
                        >
                            <LogOut size={18} />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                )}
        </nav>
    );
};

export default Navbar;
