import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authCore';
import { Mail, Lock, Phone, User, Building, CreditCard, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        bankName: '',
        bankAccount: '',
        role: 'participant'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        const result = await signup(
            formData.email,
            formData.mobile,
            formData.password,
            formData.role,
            formData.bankName,
            formData.bankAccount
        );
        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join our community and start your chit fund journey"
            isLogin={false}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        className="input-field"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Phone and Role Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            placeholder="+91 1234567890"
                            className="input-field"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                            Member Role
                        </label>
                        <select
                            name="role"
                            className="input-field"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="participant">Participant</option>
                            <option value="conductor">Conductor</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                            Bank Name
                        </label>
                        <input
                            type="text"
                            name="bankName"
                            placeholder="e.g. HDFC Bank"
                            className="input-field"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                            Account Number
                        </label>
                        <input
                            type="text"
                            name="bankAccount"
                            placeholder="Enter account number"
                            className="input-field"
                            value={formData.bankAccount}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter password"
                                className="input-field input-with-affix"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="input-affix-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                className="input-field input-with-affix"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                className="input-affix-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </AuthLayout>
    );
};

export default SignupPage;
