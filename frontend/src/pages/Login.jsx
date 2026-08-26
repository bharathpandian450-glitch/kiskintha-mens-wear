import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot Password Modal State
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotCredential, setForgotCredential] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');
    const [forgotError, setForgotError] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const [emailAlert, setEmailAlert] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEmailAlert('');

        if (!credential.trim()) {
            setError('Please enter username/email');
            return;
        }

        if (!password) {
            setError('Please enter password');
            return;
        }

        setLoading(true);

        try {
            const loggedUser = await login(credential.trim(), password);
            if (loggedUser.role === 'owner' || loggedUser.role === 'admin') {
                navigate('/owner');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Invalid Email/Mobile Number or Password.');
            setLoading(false);
        }
    };

    const handlePresetLogin = (email, pass) => {
        setCredential(email);
        setPassword(pass);
        setError('');
    };



    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setForgotError('');
        setForgotMsg('');

        if (!forgotCredential.trim()) {
            setForgotError('Please enter your Email or Mobile Number');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            setForgotError('New Password must be at least 6 characters');
            return;
        }

        setForgotLoading(true);

        try {
            const res = await API.post('/users/forgot-password', {
                credential: forgotCredential.trim(),
                newPassword
            });
            setForgotMsg(res.data.message || 'Password reset successfully!');
            setTimeout(() => {
                setShowForgotModal(false);
                setCredential(forgotCredential.trim());
                setPassword(newPassword);
            }, 1800);
        } catch (err) {
            setForgotError(err.response?.data?.message || 'Error resetting password. Please check your details.');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card shadow-gold">
                    <div className="auth-header">
                        <div className="brand-logo">👑</div>
                        <h2>Sign In</h2>
                        <p className="subtitle">Kiskintha Mens Wear — Premium Collection</p>
                    </div>

                    {/* Quick Role Login Guide Badges — STORE OWNER & CUSTOMER ONLY */}
                    <div className="preset-login-badges" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        marginBottom: '18px',
                        background: '#f8fafc',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ⚡ Quick 1-Click Role Login:
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={() => handlePresetLogin('owner@kiskinthamenswear.com', 'owner123')}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    borderRadius: '8px',
                                    border: '1px solid #b45309',
                                    background: '#fef3c7',
                                    color: '#78350f',
                                    cursor: 'pointer'
                                }}
                            >
                                👑 Store Owner Login
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePresetLogin('customer@kiskinthamenswear.com', 'customer123')}
                                style={{
                                    flex: 1,
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    borderRadius: '8px',
                                    border: '1px solid #1d4ed8',
                                    background: '#eff6ff',
                                    color: '#1e40af',
                                    cursor: 'pointer'
                                }}
                            >
                                👤 Customer Login
                            </button>
                        </div>
                    </div>



                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {emailAlert && (
                        <div className="alert alert-success" style={{ marginBottom: '16px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontWeight: '600' }}>
                            {emailAlert}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address or Mobile Number <span className="req">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Email or 10-digit mobile number"
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password <span className="req">*</span></label>
                            <div className="password-input-wrap">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember Me</span>
                            </label>
                            <button
                                type="button"
                                className="forgot-password-link"
                                onClick={() => {
                                    setForgotCredential(credential);
                                    setShowForgotModal(true);
                                }}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register" className="gold-link">Register / Create Account</Link></p>
                    </div>
                </div>
            </div>

            {/* Forgot Password Reset Modal */}
            {showForgotModal && (
                <div className="modal-overlay">
                    <div className="modal-content shadow-gold">
                        <div className="modal-header">
                            <h3>🔑 Reset Password</h3>
                            <button className="close-btn" onClick={() => setShowForgotModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                                Enter your registered Email or Mobile Number to reset your password.
                            </p>

                            {forgotError && <div className="alert alert-danger" style={{ marginBottom: '12px' }}>⚠️ {forgotError}</div>}
                            {forgotMsg && <div className="alert alert-success" style={{ marginBottom: '12px' }}>✓ {forgotMsg}</div>}

                            <form onSubmit={handleForgotPasswordSubmit}>
                                <div className="form-group">
                                    <label>Registered Email or Mobile Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email or Mobile Number"
                                        value={forgotCredential}
                                        onChange={(e) => setForgotCredential(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Min 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                    <button type="submit" className="btn btn-gold" style={{ flex: 1 }} disabled={forgotLoading}>
                                        {forgotLoading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForgotModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
