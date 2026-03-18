import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, TrendingUp, Settings, ShieldAlert, AlertCircle } from 'lucide-react';

const DashboardFeatureCards = ({ userKYCStatus }) => {
    const features = [
        {
            title: 'KYC Verification',
            description: 'Complete your identity verification',
            icon: FileText,
            link: '/kyc',
            color: 'from-blue-600 to-blue-400',
            status: userKYCStatus || 'not_started',
            alert: userKYCStatus !== 'approved'
        },
        {
            title: 'Security & 2FA',
            description: 'Secure your account with 2FA',
            icon: Shield,
            link: '/settings',
            color: 'from-green-600 to-green-400',
            alert: false
        },
        {
            title: 'Transaction History',
            description: 'View all your transactions',
            icon: TrendingUp,
            link: '/transactions',
            color: 'from-purple-600 to-purple-400',
            alert: false
        },
        {
            title: 'Account Settings',
            description: 'Manage your profile and preferences',
            icon: Settings,
            link: '/settings',
            color: 'from-yellow-600 to-yellow-400',
            alert: false
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                const statusColors = {
                    'approved': 'bg-green-500',
                    'submitted': 'bg-yellow-500',
                    'under_review': 'bg-blue-500',
                    'rejected': 'bg-red-500',
                    'not_started': 'bg-gray-500'
                };

                return (
                    <Link key={index} to={feature.link}>
                        <div className={`bg-gradient-to-br ${feature.color} p-0.5 rounded-lg hover:shadow-lg hover:shadow-current transition group`}>
                            <div className="bg-gray-900 p-6 rounded-lg h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <Icon className="text-white" size={28} />
                                    {feature.alert && (
                                        <AlertCircle className="text-orange-400" size={20} />
                                    )}
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                                <p className="text-gray-300 text-sm mb-4 flex-grow">{feature.description}</p>
                                
                                {feature.status && (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${statusColors[feature.status]}`}></div>
                                        <span className="text-xs text-gray-400 capitalize">
                                            {feature.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400 group-hover:text-white transition">
                                    Access →
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default DashboardFeatureCards;
