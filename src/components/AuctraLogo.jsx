import React from 'react';

const AuctraLogo = ({ className = "", showText = true, size = "h-10" }) => {
    return (
        <div className={`flex items-center gap-3 shrink-0 ${size} ${className}`}>
            {/* Stylized 'A' Logo recreating the User's Riboon Image */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-auto"
                style={{ minWidth: '40px' }}
            >
                <path
                    d="M50 15L15 85H35L42.5 70L50 55L57.5 70L65 85H85L50 15Z"
                    fill="url(#logo-gradient)"
                />
                <path
                    d="M50 55L42.5 70H57.5L50 55Z"
                    fill="#0b1020"
                    fillOpacity="0.85"
                />
                <path
                    d="M50 15L65 85L50 75L35 85L50 15Z"
                    fill="#ffffff"
                    fillOpacity="0.08"
                />
                <defs>
                    <linearGradient id="logo-gradient" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#a5b4fc" />
                        <stop offset="0.5" stopColor="#818cf8" />
                        <stop offset="1" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
            </svg>

            {showText && (
                <div className="flex flex-col justify-center leading-none">
                    <span className="text-2xl font-black tracking-tighter text-white uppercase">
                        AUC<span className="text-primary">TRA</span>
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-primary opacity-70 ml-0.5 mt-0.5">
                        Chit Fund Platform
                    </span>
                </div>
            )}
        </div>
    );
};

export default AuctraLogo;
