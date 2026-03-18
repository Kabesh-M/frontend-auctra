import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingDown, Users, ArrowRight, Zap, Lock } from 'lucide-react';
import * as FramerMotion from 'framer-motion';
import AuctraLogo from '../components/AuctraLogo';

const FeatureCard = ({ icon, title, desc }) => (
    <FramerMotion.motion.div
        whileHover={{ y: -10 }}
        className="glass p-8 rounded-2xl border transition-all hover:border-primary flex flex-col items-start gap-4"
    >
        <div className="bg-primary bg-opacity-10 w-14 h-14 rounded-xl flex items-center justify-center shrink-0">
            {React.createElement(icon, { className: 'text-primary', size: 28 })}
        </div>
        <div>
            <h3 className="text-2xl font-extrabold text-main mb-2">{title}</h3>
            <p className="text-muted leading-relaxed text-sm">{desc}</p>
        </div>
    </FramerMotion.motion.div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto sticky top-4 z-50">
                <div className="glass p-4 px-6 flex justify-between items-center rounded-2xl">
                <AuctraLogo className="h-10 cursor-pointer" />
                 <div className="flex items-center gap-8">
                    <a href="#features" className="text-muted hover:text-primary transition-all text-xs uppercase tracking-widest font-extrabold">Features</a>
                    <button
                        onClick={() => navigate('/login')}
                        className="btn-primary"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="btn-secondary"
                    >
                        Sign Up
                    </button>
                </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(99,102,241,0.25), transparent 40%)' }} />

                <FramerMotion.motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="bg-primary bg-opacity-10 text-primary px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-6" style={{ display: 'inline-block' }}>
                        Production Ready • Secure • Real-time
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 hero-gradient leading-[0.9]">
                        Chit Fund <br /> <span className="text-primary">Auction Platform</span>
                    </h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Modern community savings platform. Securely create, join, and participate in chit fund auctions with complete transparency and security.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary py-4 px-10 text-lg"
                        >
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button className="btn-secondary py-4 px-10 text-lg">
                            Learn More
                        </button>
                    </div>
                </FramerMotion.motion.div>
            </header>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={Shield}
                        title="Secure Records"
                        desc="Every bid, payment, and transaction is securely recorded with complete audit trails for full transparency."
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Fast & Reliable"
                        desc="Lightning-fast bidding system ensures smooth auctions even during peak activity times."
                    />
                    <FeatureCard
                        icon={Lock}
                        title="Bank-Level Security"
                        desc="Your data is protected with industry-standard encryption to prevent unauthorized access."
                    />
                    <FeatureCard
                        icon={TrendingDown}
                        title="Automatic Payments"
                        desc="Smart system handles payment distributions and generates detailed financial reports automatically."
                    />
                    <FeatureCard
                        icon={Users}
                        title="User Roles"
                        desc="Clear permissions for Conductors and Participants ensure a fair and organized auction process."
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Data Protection"
                        desc="All sensitive information is encrypted using industry-standard security protocols."
                    />
                </div>
            </section>

            {/* Trust Banner */}
            <section className="py-24" style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.4)' }}>
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-black tracking-tighter mb-6 uppercase">Trusted Platform</h2>
                    <p className="text-muted mb-10 font-medium">AUCTRA provides the transparency and reliability needed to run community savings funds efficiently.</p>
                    <div className="flex flex-wrap justify-center gap-12" style={{ opacity: 0.25 }}>
                        <div className="font-black text-3xl tracking-tighter">FINTECH</div>
                        <div className="font-black text-3xl tracking-tighter">SECURE.IO</div>
                        <div className="font-black text-3xl tracking-tighter">COMMUNITY</div>
                        <div className="font-black text-3xl tracking-tighter">LEDGER</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6" style={{ borderTop: '1px solid var(--glass-border)' }}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <AuctraLogo showText={false} className="h-8" />
                    <div className="text-dim text-xs font-bold uppercase tracking-widest">
                        © 2026 AUCTRA. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-dim hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Security</a>
                        <a href="#" className="text-dim hover:text-white transition-all text-xs font-bold uppercase tracking-widest">About</a>
                        <a href="#" className="text-dim hover:text-white transition-all text-xs font-bold uppercase tracking-widest">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
