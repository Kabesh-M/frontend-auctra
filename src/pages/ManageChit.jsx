import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authCore';
import { ShieldCheck, UserCheck, UserX, ArrowLeft, Calendar, FileText, Download, TrendingDown, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

const ManageChit = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [report, setReport] = useState(null);
    const [activeTab, setActiveTab] = useState('participants');
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [auctionDate, setAuctionDate] = useState('');
    const [schedulingAuction, setSchedulingAuction] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [participantsRes, reportRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/chits/${id}/participants`, config),
                axios.get(`http://localhost:5000/api/chits/${id}/report`, config)
            ]);
            setParticipants(participantsRes.data);
            setReport(reportRes.data);
        } catch {
            toast.error('Failed to fetch data');
        }
    }, [id, user]);

    useEffect(() => {
        setTimeout(() => {
            fetchData();
        }, 0);
    }, [id, fetchData]);

    const handleApprove = async (participantId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/chits/${id}/approve/${participantId}`,
                { approved: status },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            toast.success(status ? 'Member Approved' : 'Member Unapproved');
            fetchData();
        } catch {
            toast.error('Action failed');
        }
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('AUCTRA CHIT REPORT', 14, 22);
        doc.setFontSize(10);
        doc.text(`Log Code: ${report.chit.logCode}`, 14, 30);
        doc.text(`Total Amount: INR ${report.report.reduce((acc, curr) => acc + curr.contribution, 0)}`, 14, 35);

        // Manual table implementation
        let startY = 45;
        const cellHeight = 8;
        const colPositions = [14, 54, 89, 119, 149];

        // Table headers
        doc.setFontSize(12);
        doc.text('Date', colPositions[0], startY);
        doc.text('Winner', colPositions[1], startY);
        doc.text('Final Bid', colPositions[2], startY);
        doc.text('Dividend', colPositions[3], startY);
        doc.text('Contribution', colPositions[4], startY);

        // Draw header line
        doc.line(14, startY + 2, 184, startY + 2);
        startY += cellHeight;

        // Table rows
        doc.setFontSize(10);
        report.report.forEach((row) => {
            if (startY > 270) {
                doc.addPage();
                startY = 20;
            }

            doc.text(new Date(row.auctionDate).toLocaleDateString(), colPositions[0], startY);
            doc.text(row.winner, colPositions[1], startY);
            doc.text(`₹${row.finalBid.toLocaleString()}`, colPositions[2], startY);
            doc.text(`₹${row.dividend.toFixed(2)}`, colPositions[3], startY);
            doc.text(`₹${row.contribution.toFixed(2)}`, colPositions[4], startY);

            // Draw row line
            doc.line(14, startY + 2, 184, startY + 2);
            startY += cellHeight;
        });

        doc.save(`Auctra_Report_${report.chit.logCode}.pdf`);
    };

    const handleScheduleAuction = async () => {
        if (!auctionDate) {
            toast.error('Please select an auction date');
            return;
        }

        const selectedDate = new Date(auctionDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error('Auction date cannot be in the past');
            return;
        }

        setSchedulingAuction(true);
        try {
            await axios.post('http://localhost:5000/api/auctions',
                {
                    chitId: id,
                    auctionDate: auctionDate
                },
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );
            toast.success('Auction scheduled successfully');
            setShowScheduleModal(false);
            setAuctionDate('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule auction');
        } finally {
            setSchedulingAuction(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2 mb-8" style={{ background: 'none', border: 'none' }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-main tracking-tighter uppercase mb-1">
                            {report?.chit.logCode || 'Manage Chit'}
                        </h1>
                        <p className="text-muted text-sm font-medium">Total Value: <span className="text-primary font-bold">₹{report?.chit.totalAmount.toLocaleString()}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={exportPDF}
                            className="btn-secondary"
                        >
                            <Download size={18} className="shrink-0" /> Export PDF
                        </button>
                        <button 
                            onClick={() => setShowScheduleModal(true)}
                            className="btn-primary"
                        >
                            <Calendar size={18} className="shrink-0" /> Schedule Auction
                        </button>
                    </div>
                </header>

                <div className="flex gap-8 border-b mb-8" style={{ borderColor: 'var(--glass-border)' }}>
                    <button
                        onClick={() => setActiveTab('participants')}
                        className={`pb-4 px-2 font-bold uppercase tracking-widest text-sm transition-all`}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeTab === 'participants' ? 'var(--primary)' : 'var(--text-dim)',
                            borderBottom: activeTab === 'participants' ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        Participants
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`pb-4 px-2 font-bold uppercase tracking-widest text-sm transition-all`}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: activeTab === 'report' ? 'var(--primary)' : 'var(--text-dim)',
                            borderBottom: activeTab === 'report' ? '2px solid var(--primary)' : '2px solid transparent'
                        }}
                    >
                        Auction Report
                    </button>
                </div>

                {activeTab === 'participants' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="glass overflow-hidden">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Member</th>
                                            <th>Status</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map((p) => (
                                            <tr key={p._id}>
                                                <td className="font-bold">{p.mobile}</td>
                                                <td>
                                                    {p.approved ? (
                                                        <span className="badge badge-success">APPROVED</span>
                                                    ) : (
                                                        <span className="badge badge-warning">PENDING</span>
                                                    )}
                                                </td>
                                                <td className="text-right">
                                                    <button
                                                        onClick={() => handleApprove(p._id, !p.approved)}
                                                        className="btn-secondary"
                                                        style={{ padding: '0.5rem', border: 'none', background: 'transparent' }}
                                                    >
                                                        {p.approved ? <UserX size={20} color="var(--error)" /> : <UserCheck size={20} color="var(--primary)" />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="glass p-6 h-fit">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-primary uppercase text-sm"><TrendingDown size={18} /> Stats</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Total Joined</span>
                                    <span className="font-bold">{participants.length} / {report?.chit.participantsCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Approved</span>
                                    <span className="font-bold text-primary">{participants.filter(p => p.approved).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="glass overflow-hidden">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Winner</th>
                                    <th>Final Bid</th>
                                    <th>Dividend</th>
                                    <th>Contribution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report?.report.map((row, i) => (
                                    <tr key={i}>
                                        <td className="text-sm font-mono text-dim">{new Date(row.auctionDate).toLocaleDateString()}</td>
                                        <td className="font-bold text-primary">{row.winner}</td>
                                        <td className="font-bold" style={{ color: 'var(--warning)' }}>₹{row.finalBid.toLocaleString()}</td>
                                        <td className="font-bold text-success">₹{row.dividend.toLocaleString()}</td>
                                        <td className="font-bold">₹{row.contribution.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {report?.report.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center text-muted italic">No auctions completed yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Schedule Auction Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-main uppercase tracking-tighter">Schedule Auction</h2>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="text-muted hover:text-main transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted mb-2">Auction Date</label>
                                <input
                                    type="datetime-local"
                                    value={auctionDate}
                                    onChange={(e) => setAuctionDate(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-primary focus:outline-none"
                                    style={{ 
                                        backgroundColor: '#ffffff',
                                        color: '#1f2937',
                                        border: '1px solid #d1d5db'
                                    }}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setShowScheduleModal(false)}
                                    className="btn-secondary flex-1"
                                    disabled={schedulingAuction}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleScheduleAuction}
                                    className="btn-primary flex-1"
                                    disabled={schedulingAuction}
                                >
                                    {schedulingAuction ? 'Scheduling...' : 'Schedule Auction'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageChit;
