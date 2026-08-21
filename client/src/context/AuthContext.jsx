import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, resetPassword, logoutUser, getUserProfile } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kmw_user') || sessionStorage.getItem('kmw_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('kmw_token') || sessionStorage.getItem('kmw_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      getUserProfile()
        ? getUserProfile()
            .then((data) => setUser(data))
            .catch(() => logout())
        : setLoading(false);
    }
    setLoading(false);
  }, [token]);

  const login = async (loginId, password, rememberMe = false) => {
    const data = await loginUser({ loginId, password, rememberMe });
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem('kmw_token', data.token);
    storage.setItem('kmw_user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    return data;
  };

  const forgotPassword = async (resetData) => {
    const data = await resetPassword(resetData);
    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('kmw_token');
    localStorage.removeItem('kmw_user');
    sessionStorage.removeItem('kmw_token');
    sessionStorage.removeItem('kmw_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        forgotPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
