import React from 'react';
import { Link } from 'react-router-dom';
import AuctraLogo from './AuctraLogo';

const AuthLayout = ({ children, title, subtitle, isLogin = false }) => {
    return (
        <div className="auth-shell bg-dark">
            <div className="glass auth-card">
                <div className="flex flex-col items-center gap-6 mb-8">
                    <AuctraLogo showText={true} />
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tighter text-main mb-2 uppercase">
                            {title}
                        </h2>
                        <p className="text-muted text-sm font-medium">
                            {subtitle}
                        </p>
                    </div>
                </div>
                {children}
                <div className="mt-8 text-center">
                    <p className="text-dim text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <Link
                            to={isLogin ? "/signup" : "/login"}
                            className="text-primary font-bold uppercase tracking-widest text-xs"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
