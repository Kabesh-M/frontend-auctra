import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authCore';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Wallet, Calendar, TrendingDown, LogIn, ShieldCheck, LogOut } from 'lucide-react';
import * as FramerMotion from 'framer-motion';
import CreateChitModal from '../components/CreateChitModal';
import DashboardFeatureCards from '../components/DashboardFeatureCards';
import { toast } from 'react-hot-toast';
import AuctraLogo from '../components/AuctraLogo';

const SidebarItem = ({ icon, label, active, onClick, color = "" }) => (
    <button
        onClick={onClick}
        className={`sidebar-item flex items-center gap-3 ${active ? 'active' : ''}`}
        style={color ? { color } : {}}
    >
        {React.createElement(icon, { size: 20, className: 'shrink-0' })}
        <span className="font-bold uppercase tracking-widest text-[10px]">{label}</span>
    </button>
);

const StatCard = ({ label, value, icon, colorClass }) => (
    <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{label}</p>
                <h3 className="text-2xl font-black text-main tracking-tighter">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl flex items-center justify-center ${colorClass}`} style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.15), rgba(79,70,229,0.15))', border: '1px solid rgba(99,102,241,0.35)' }}>
                {React.createElement(icon, { size: 22, className: 'shrink-0' })}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [chits, setChits] = useState({ participations: [], conducted: [] });
    const [auctions, setAuctions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [showJoinForm, setShowJoinForm] = useState(false);

    const fetchChits = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/chits/my', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setChits(data);
        } catch {
            console.error('Error fetching chits');
        }
    }, [user]);

    const fetchAuctions = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/auctions/my', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAuctions(data);
        } catch {
            console.error('Error fetching auctions');
        }
    }, [user.token]);

    useEffect(() => {
        setTimeout(() => {
            fetchChits();
            fetchAuctions();
        }, 0);
    }, [user, fetchChits, fetchAuctions]);

    const handleJoinChit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/chits/join',
                { logCode: joinCode, password: joinPassword },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            toast.success('Chit Joined Successfully!');
            setShowJoinForm(false);
            fetchChits();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join chit');
        }
    };

    return (
        <div className="flex min-h-screen bg-dark">
            <div className="sidebar flex flex-col gap-10">
                <AuctraLogo showText={true} className="px-2" />

                <nav className="flex flex-col gap-3 flex-grow">
                    <SidebarItem icon={Wallet} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarItem icon={Users} label="My Chits" active={activeTab === 'chits'} onClick={() => setActiveTab('chits')} />
                    <SidebarItem icon={Calendar} label="Auctions" active={activeTab === 'auctions'} onClick={() => setActiveTab('auctions')} />

                    {user?.role === 'admin' && (
                        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                            <SidebarItem
                                icon={ShieldCheck}
                                label="Admin Panel"
                                active={false}
                                onClick={() => navigate('/admin')}
                                color="var(--primary)"
                            />
                        </div>
                    )}
                </nav>

                <div className="pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <SidebarItem icon={LogOut} label="Logout" active={false} onClick={logout} color="var(--error)" />
                </div>
            </div>

            <div className="flex-grow p-10 overflow-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard</h1>
                        <p className="text-muted text-sm font-medium">Welcome, <span className="text-primary">{user?.email}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowJoinForm(!showJoinForm)}
                            className="btn-secondary"
                        >
                            <LogIn size={20} /> Join Chit
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary"
                        >
                            <Plus size={20} /> New Chit
                        </button>
                    </div>
                </header>

                {showJoinForm && (
                    <FramerMotion.motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={handleJoinChit}
                        className="glass p-8 rounded-3xl mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 border-primary border-opacity-20 shadow-[0_0_50px_rgba(0,255,204,0.05)]"
                    >
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Chit Code</label>
                            <input
                                placeholder="e.g. SEP-CHIT"
                                className="input-field"
                                value={joinCode}
                                onChange={e => setJoinCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-field"
                                value={joinPassword}
                                onChange={e => setJoinPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn-primary w-full py-3.5">Join Chit</button>
                        </div>
                    </FramerMotion.motion.form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard label="Active Chits" value={chits.participations.length} icon={Users} colorClass="text-primary" />
                    <StatCard label="Total Value" value="₹2,40k" icon={Wallet} colorClass="text-primary" />
                    <StatCard label="Next Auction" value={auctions.length > 0 ? new Date(auctions[0]?.auctionDate).toLocaleDateString() : 'None'} icon={Calendar} colorClass="text-primary" />
                    <StatCard label="My Chits" value={chits.conducted.length} icon={ShieldCheck} colorClass="text-primary" />
                </div>

                    {activeTab === 'overview' && (
                        <section className="mb-12">
                            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Quick Access Features</h2>
                            <DashboardFeatureCards userKYCStatus={user?.kycStatus} />
                        </section>
                    )}



                {activeTab === 'overview' && (
                    <>
                        <section className="mb-12">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
                                My Chit Participations <span className="badge badge-success">{chits.participations.length}</span>
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {chits.participations.length > 0 ? chits.participations.map(chit => (
                                    <div
                                        key={chit._id}
                                        className="glass p-8 rounded-3xl flex justify-between items-center transition-all hover:border-primary cursor-pointer group shadow-sm hover:shadow-primary hover:shadow-opacity-10"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="bg-primary bg-opacity-10 p-4 rounded-2xl group-hover:bg-primary transition-all">
                                                <label className="text-primary group-hover:text-dark font-black">AC</label>
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-xl tracking-tight uppercase">{chit.logCode}</h4>
                                                <p className="text-muted text-xs font-bold uppercase tracking-widest">Amount: ₹{chit.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="badge badge-success mb-2">
                                                {chit.status}
                                            </span>
                                            <p className="text-[10px] text-dim font-bold uppercase tracking-widest">Window: 12 Feb</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="glass p-16 rounded-3xl text-center col-span-2 text-muted italic font-medium">
                                        No active chit participations found.
                                    </div>
                                )}
                            </div>
                        </section>

                        {chits.conducted.length > 0 && (
                            <section>
                                <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
                                    My Conducted Chits <span className="badge badge-warning">{chits.conducted.length}</span>
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {chits.conducted.map(chit => (
                                        <div key={chit._id} className="glass p-8 rounded-3xl flex justify-between items-center border-l-4 border-warning shadow-sm">
                                            <div>
                                                <h4 className="font-extrabold text-xl tracking-tight uppercase">{chit.logCode}</h4>
                                                <p className="text-muted text-xs font-bold uppercase tracking-widest">Total Amount: ₹{chit.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate(`/manage/${chit._id}`)}
                                                    className="btn-secondary py-2.5 px-6 text-[10px]"
                                                >Manage</button>
                                                <button
                                                    onClick={() => navigate(`/auction/${chit._id}`)}
                                                    className="btn-primary py-2.5 px-6 text-[10px]"
                                                >Auction</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}

                {activeTab === 'auctions' && (
                    <section>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
                            Scheduled Auctions <span className="badge badge-primary">{auctions.length}</span>
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {auctions.length > 0 ? auctions.map(auction => (
                                <div key={auction._id} className="glass p-8 rounded-3xl border-l-4 border-primary shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-extrabold text-xl tracking-tight uppercase">{auction.chit.logCode}</h4>
                                            <p className="text-muted text-xs font-bold uppercase tracking-widest">Total: ₹{auction.chit.totalAmount.toLocaleString()}</p>
                                        </div>
                                        <span className={`badge ${
                                            auction.status === 'scheduled' ? 'badge-warning' :
                                            auction.status === 'ongoing' ? 'badge-success' :
                                            'badge-secondary'
                                        }`}>
                                            {auction.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Auction Date:</span>
                                            <span className="font-bold">{new Date(auction.auctionDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Time:</span>
                                            <span className="font-bold">{new Date(auction.auctionDate).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Floor Price:</span>
                                            <span className="font-bold text-primary">₹{auction.chit.floorPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/auction/${auction._id}`)}
                                                className="btn-primary py-2.5 px-6 text-[10px] flex-1"
                                            >View Auction</button>
                                            {auction.status === 'ongoing' && (
                                                <button
                                                    onClick={() => navigate(`/auction/${auction._id}/bid`)}
                                                    className="btn-secondary py-2.5 px-6 text-[10px] flex-1"
                                                >Join Bidding</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="glass p-16 rounded-3xl text-center col-span-2 text-muted italic font-medium">
                                    No scheduled auctions found.
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'chits' && (
                    <section>
                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
                            My Chits <span className="badge badge-primary">{chits.participations.length + chits.conducted.length}</span>
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {chits.participations.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-primary">Participations</h3>
                                    {chits.participations.map(chit => (
                                        <div key={chit._id} className="glass p-6 rounded-2xl mb-4 border-l-4 border-success">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-extrabold text-lg tracking-tight">{chit.logCode}</h4>
                                                    <p className="text-muted text-xs">Amount: ₹{chit.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <span className="badge badge-success">{chit.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {chits.conducted.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-warning">Conducted</h3>
                                    {chits.conducted.map(chit => (
                                        <div key={chit._id} className="glass p-6 rounded-2xl mb-4 border-l-4 border-warning">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-extrabold text-lg tracking-tight">{chit.logCode}</h4>
                                                    <p className="text-muted text-xs">Amount: ₹{chit.totalAmount.toLocaleString()}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/manage/${chit._id}`)}
                                                        className="btn-secondary py-1.5 px-3 text-[10px]"
                                                    >Manage</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <CreateChitModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    token={user.token}
                    onCreated={fetchChits}
                />
            </div>
        </div>
    );
};

export default Dashboard;
