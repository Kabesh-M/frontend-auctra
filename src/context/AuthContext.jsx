import React, { useState } from 'react';
import axios from 'axios';
import { AuthContext } from './authCore';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('auctra_user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading] = useState(false);

    const signup = async (email, mobile, password, role, bankName, bankAccount) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/signup', {
                email,
                mobile,
                password,
                role,
                bankName,
                bankAccount
            });
            setUser(data);
            localStorage.setItem('auctra_user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('auctra_user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auctra_user');
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
