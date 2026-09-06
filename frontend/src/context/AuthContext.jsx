import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });
    const [token, setToken] = useState(() => {
        try {
            const savedToken = localStorage.getItem('token');
            if (savedToken && (savedToken.startsWith('kiskintha_') || savedToken === 'null' || savedToken === 'undefined')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return null;
            }
            return savedToken || null;
        } catch (e) {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    // Keep auth state in sync with localStorage
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && (savedToken.startsWith('kiskintha_') || savedToken === 'null' || savedToken === 'undefined')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } else if (savedToken && savedUser && (!token || !user)) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (e) {}
        }
        setLoading(false);
    }, [token, user]);

    const login = async (credential, password, selectedRole = 'customer') => {
        const cleanInput = (credential || '').toString().trim();
        const userPass = (password || '').toString();

        if (!cleanInput) {
            throw new Error('Please enter username/email');
        }
        if (!userPass) {
            throw new Error('Please enter password');
        }

        const cleanLower = cleanInput.toLowerCase();
        const isOwnerAttempt = (selectedRole === 'owner') ||
                               cleanLower === 'kiskinthowner' ||
                               cleanLower === 'kiskinthaowner' ||
                               cleanLower.includes('kiskinthaowner@') ||
                               cleanLower.includes('kiskinthowner@');

        if (isOwnerAttempt) {
            try {
                const res = await API.post('/users/login', {
                    credential: cleanInput,
                    password: userPass,
                    role: 'owner'
                });

                if (res.data && res.data.token && res.data.user && res.data.user.role === 'owner') {
                    const newToken = res.data.token;
                    const newUser = res.data.user;
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('user', JSON.stringify(newUser));
                    setToken(newToken);
                    setUser(newUser);
                    return newUser;
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (apiErr) {
                const errMsg = apiErr.response?.data?.message || 'Invalid credentials';
                throw new Error(errMsg);
            }
        }

        // Customer Login Handler
        try {
            const res = await API.post('/users/login', {
                credential: cleanInput,
                password: userPass,
                role: 'customer'
            });

            if (res.data && res.data.token && res.data.user) {
                const newToken = res.data.token;
                const newUser = res.data.user;
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                setToken(newToken);
                setUser(newUser);
                return newUser;
            } else {
                throw new Error('Login failed. Unable to authenticate session.');
            }
        } catch (apiErr) {
            const errMsg = apiErr.response?.data?.message || apiErr.message || 'Login failed. Please check credentials.';
            throw new Error(errMsg);
        }
    };

    const register = async (data) => {
        try {
            const res = await API.post('/users/register', data);
            const { token: newToken, user: newUser } = res.data || {};
            if (newToken && newUser) {
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(newUser));
                setToken(newToken);
                setUser(newUser);
                return newUser;
            } else {
                throw new Error('Registration failed.');
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            throw new Error(errMsg);
        }
    };

    const updateProfile = async (data) => {
        let updatedUser = null;
        try {
            const res = await API.put('/users/profile', data);
            if (res.data && res.data.user) {
                updatedUser = res.data.user;
            }
        } catch (err) {}

        if (!updatedUser) {
            updatedUser = { ...user, ...data };
        }

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, updateProfile, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
