import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authCore';
import { io } from 'socket.io-client';
import { Timer, ArrowLeft, TrendingDown, Users, ShieldCheck } from 'lucide-react';
import * as FramerMotion from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AuctionScreen = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [bids, setBids] = useState([]);
    const [myBid, setMyBid] = useState('');
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const socketRef = useRef();

    const fetchAuctionDetails = useCallback(async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/auctions/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setData(data);
            setBids((data.bids || []).map(b => ({
                id: b._id,
                user: b.participant?.user?.mobile || b.participant?.mobile || 'Unknown',
                amount: b.bidAmount,
                time: new Date(b.bidTime).toLocaleTimeString()
            })));
        } catch (error) {
            console.error('Auction fetch error:', error);
            if (error.response?.status === 404) {
                setNotFound(true);
            } else {
                toast.error('Failed to load auction data');
            }
        }
    }, [id, user]);

    useEffect(() => {
        setTimeout(() => {
            fetchAuctionDetails();
        }, 0);
        
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_auction', id);

        socketRef.current.on('new_bid', (bid) => {
            setBids(prev => [{
                id: bid.id,
                user: bid.user,
                amount: bid.amount,
                time: new Date(bid.time).toLocaleTimeString()
            }, ...prev]);
            toast.success('New bid: ₹' + bid.amount);
        });

        socketRef.current.on('auction_ended', (winnerData) => {
            setAuctionEnded(true);
            toast.error(`Auction Ended! Winner: ${winnerData.winner}`, { duration: 10000 });
        });

        return () => socketRef.current.disconnect();
    }, [id, fetchAuctionDetails]);

    const handleBid = async (amount) => {
        if (auctionEnded) return toast.error('Auction has ended');

        try {
            await axios.post(`http://localhost:5000/api/auctions/${id}/bid`,
                { bidAmount: amount },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setMyBid('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place bid');
        }
    };

    if (notFound) return (
        <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-6 p-6">
            <div className="glass p-10 rounded-3xl text-center max-w-md">
                <ShieldCheck size={48} className="text-error mx-auto mb-4 opacity-60" />
                <h2 className="text-2xl font-extrabold text-main uppercase tracking-tighter mb-2">Auction Not Found</h2>
                <p className="text-muted text-sm mb-6">This auction does not exist or has not been scheduled yet. Please go back and create or schedule an auction first.</p>
                <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 py-3">
                    <ArrowLeft size={16} /> Go to Dashboard
                </button>
            </div>
        </div>
    );

    if (!data) return <div className="min-h-screen bg-dark flex items-center justify-center text-primary font-bold">Synchronizing with Auction Server...</div>;

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <header className="glass p-4 flex justify-between items-center sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="btn-secondary flex items-center gap-2" style={{ border: 'none', background: 'transparent', padding: '0.5rem' }}>
                    <ArrowLeft size={18} className="shrink-0" />
                    <span className="font-bold">Back</span>
                </button>
                <div className="text-center">
                    <h2 className="font-extrabold text-main text-lg uppercase tracking-widest">{data.auction.chit.logCode}</h2>
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <ShieldCheck size={14} className="shrink-0" />
                        <span className="text-[10px] uppercase tracking-widest font-extrabold">Auctra Secure Node</span>
                    </div>
                </div>
                <div className={`badge ${auctionEnded ? 'badge-error' : 'badge-success'}`} style={{ padding: '0.625rem 1.25rem', fontSize: '0.75rem' }}>
                    <Timer size={16} className="shrink-0" />
                    <span className="font-mono font-extrabold">{auctionEnded ? 'ENDED' : 'LIVE'}</span>
                </div>
            </header>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 p-6 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="glass p-6 rounded-2xl">
                        <h3 className="text-muted text-xs mb-4 uppercase tracking-widest font-bold">Auction Metrics</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between">
                                <span className="text-muted text-sm">Total Value</span>
                                <span className="font-bold">₹{data.auction.chit.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted text-sm">Floor Price</span>
                                <span className="font-bold">₹{data.auction.chit.floorPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-opacity-5 rounded-2xl text-center" style={{ backgroundColor: 'rgba(0, 255, 204, 0.05)', border: '1px solid var(--glass-border)' }}>
                            <p className="text-xs text-primary mb-1 uppercase font-bold tracking-widest">Current Winning Bid</p>
                            <h4 className="text-4xl font-bold text-primary">
                                ₹{(bids[0]?.amount || data.auction.chit.totalAmount).toLocaleString()}
                            </h4>
                        </div>
                    </div>

                    {!auctionEnded && (
                        <div className="glass p-6 rounded-2xl">
                            <h3 className="text-muted text-xs mb-4 uppercase tracking-widest font-bold">Fixed Bid Options</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {data.auction.chit.bidOptions.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => handleBid((bids[0]?.amount || data.auction.chit.totalAmount) - amt)}
                                        className="btn-secondary py-3 text-xs"
                                    >
                                        -₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="glass rounded-3xl flex-grow overflow-hidden flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center bg-dark-secondary">
                            <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <TrendingDown size={14} className="text-primary" /> Live Transaction Stream
                            </h3>
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                <span className="text-xs text-muted uppercase font-bold">Connected</span>
                            </span>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4" style={{ maxHeight: '500px' }}>
                            <FramerMotion.AnimatePresence initial={false}>
                                {bids.map((bid, index) => (
                                    <FramerMotion.motion.div
                                        key={bid.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex justify-between items-center p-4 rounded-2xl ${index === 0 ? 'border-primary' : ''
                                            }`}
                                        style={{ backgroundColor: index === 0 ? 'rgba(0, 255, 204, 0.05)' : 'var(--dark-secondary)', border: index === 0 ? '1px solid var(--primary)' : '1px solid transparent' }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: index === 0 ? 'var(--primary)' : 'var(--dark-tertiary)', color: index === 0 ? 'var(--dark)' : 'var(--text-muted)' }}>
                                                {(bid.user || '?').substring(0, 1)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm tracking-tight">{index === 0 ? '🏆 Leading Bidder' : bid.user}</p>
                                                <p className="text-xs text-dim font-mono uppercase">{bid.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-mono text-xl font-bold ${index === 0 ? 'text-primary' : ''}`}>
                                                ₹{bid.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    </FramerMotion.motion.div>
                                ))}
                            </FramerMotion.AnimatePresence>

                            {bids.length === 0 && (
                                <div className="flex-grow flex flex-col items-center justify-center text-dim py-20">
                                    <TrendingDown size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p className="italic uppercase tracking-widest text-xs font-bold">Awaiting first transaction...</p>
                                </div>
                            )}
                        </div>

                        {!auctionEnded ? (
                            <div className="p-6 border-t bg-dark-secondary">
                                <div className="flex gap-4">
                                    <div className="relative flex-grow">
                                        <span className="absolute font-bold text-muted" style={{ left: '1rem', top: '0.85rem' }}>₹</span>
                                        <input
                                            type="number"
                                            placeholder="Enter specific bid amount..."
                                            className="input-field w-full"
                                            style={{ paddingLeft: '2rem' }}
                                            value={myBid}
                                            onChange={(e) => setMyBid(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleBid(Number(myBid))}
                                        disabled={!myBid || auctionEnded}
                                        className="btn-primary px-10"
                                    >
                                        Submit Bid
                                    </button>
                                </div>
                                <p className="text-xs text-dim mt-4 text-center uppercase tracking-widest font-bold">
                                    Immutable Transaction Security Enabled
                                </p>
                            </div>
                        ) : (
                            <div className="p-10 text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                                <h4 className="text-error font-bold uppercase tracking-widest mb-2">Auction Concluded</h4>
                                <p className="text-muted text-sm">Winner has been secured and locking rules applied.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionScreen;
