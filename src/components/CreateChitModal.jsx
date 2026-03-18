import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateChitModal = ({ isOpen, onClose, token, onCreated }) => {
    const [formData, setFormData] = useState({
        logCode: '',
        password: '',
        totalAmount: '',
        participantsCount: '',
        floorPrice: '',
        bidOptions: '100,500,1000,2000',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const payload = {
                ...formData,
                totalAmount: Number(formData.totalAmount),
                participantsCount: Number(formData.participantsCount),
                floorPrice: Number(formData.floorPrice),
                bidOptions: formData.bidOptions.split(',').map(Number)
            };

            await axios.post('http://localhost:5000/api/chits', payload, config);
            toast.success('Chit Log Created!');
            onCreated();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create chit');
        }
    };

    return (
        <div className="fixed flex items-center justify-center p-4" style={{ inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
            <div className="glass w-full max-w-lg p-10 relative">
                <button onClick={onClose} className="btn-secondary absolute" style={{ border: 'none', background: 'transparent', top: '1.25rem', right: '1.25rem', padding: '0.5rem' }}>
                    <X size={24} className="text-muted hover:text-white transition-all" />
                </button>

                <h2 className="text-3xl font-extrabold mb-8 text-primary uppercase tracking-tighter">Create New Chit Log</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="lg:col-span-2">
                        <label className="text-muted text-xs font-bold uppercase tracking-widest mb-1 block">Shared Log Code</label>
                        <input
                            className="input-field"
                            placeholder="e.g. SEP-CHIT-2026"
                            onChange={(e) => setFormData({ ...formData, logCode: e.target.value })}
                            required
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <label className="text-muted text-xs font-bold uppercase tracking-widest mb-1 block">Access Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Keep it secure"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="text-muted text-xs font-bold uppercase tracking-widest mb-1 block">Total Amount</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="100000"
                            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="text-muted text-xs font-bold uppercase tracking-widest mb-1 block">Participants</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="10"
                            onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="text-muted text-xs font-bold uppercase tracking-widest mb-1 block">Floor Price</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="1000"
                            onChange={(e) => setFormData({ ...formData, floorPrice: e.target.value })}
                            required
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="text-muted text-xs font-bold uppercase tracking-widest mb-1 block">Bid Options (CSV)</label>
                        <input
                            className="input-field"
                            placeholder="100,200,500"
                            value={formData.bidOptions}
                            onChange={(e) => setFormData({ ...formData, bidOptions: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary mt-4 lg:col-span-2 py-4">
                        Create & Generate Log
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateChitModal;
