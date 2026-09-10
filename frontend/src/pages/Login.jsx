import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [loginRole, setLoginRole] = useState('customer'); // 'customer' or 'owner'
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
            const loggedUser = await login(credential.trim(), password, loginRole);
            if (loggedUser && (loggedUser.role === 'owner' || loggedUser.role === 'admin')) {
                navigate('/owner');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || (loginRole === 'owner' ? 'Invalid owner credentials' : 'Invalid Email/Mobile Number or Password.'));
            setLoading(false);
        }
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

                    {user && (
                        <div className="alert alert-info" style={{ marginBottom: '16px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                            ℹ️ You are currently signed in as <strong>{user.name}</strong> ({user.role}). You can sign in with another account below or <Link to={user.role === 'owner' || user.role === 'admin' ? '/owner' : '/'} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>go to {user.role === 'owner' || user.role === 'admin' ? 'Owner Portal' : 'Store'}</Link>.
                        </div>
                    )}

                    {/* Role Selector Tabs (Customer Login vs Store Owner Login) */}
                    <div className="login-role-tabs" style={{
                        display: 'flex',
                        background: '#f1f5f9',
                        padding: '5px',
                        borderRadius: '12px',
                        marginBottom: '14px',
                        gap: '6px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginRole('customer');
                                setCredential('');
                                setPassword('');
                                setError('');
                            }}
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                borderRadius: '8px',
                                border: loginRole === 'customer' ? '1px solid #2563eb' : '1px solid transparent',
                                background: loginRole === 'customer' ? '#ffffff' : 'transparent',
                                color: loginRole === 'customer' ? '#1d4ed8' : '#64748b',
                                boxShadow: loginRole === 'customer' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            👤 Customer Login
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setLoginRole('owner');
                                setCredential('');
                                setPassword('');
                                setError('');
                            }}
                            style={{
                                flex: 1,
                                padding: '10px 12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                borderRadius: '8px',
                                border: loginRole === 'owner' ? '1px solid #d97706' : '1px solid transparent',
                                background: loginRole === 'owner' ? '#ffffff' : 'transparent',
                                color: loginRole === 'owner' ? '#b45309' : '#64748b',
                                boxShadow: loginRole === 'owner' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            👑 Store Owner Login
                        </button>
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

                    <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
                        <div className="form-group">
                            <label>{loginRole === 'owner' ? 'Store Owner Username / Email' : 'Customer Email Address or Mobile'} <span className="req">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={loginRole === 'owner' ? 'Enter Owner Username or Email' : 'Enter Customer Email or 10-digit mobile'}
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                autoComplete="off"
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
                                    autoComplete="new-password"
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
