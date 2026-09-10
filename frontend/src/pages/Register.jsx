import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const { user, register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        agreeTerms: true
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Client-side validations
        if (!formData.name.trim()) {
            setError('Please enter your Full Name');
            return;
        }

        const cleanPhone = (formData.phone || '').replace(/\D/g, '').slice(-10);
        if (cleanPhone.length !== 10) {
            setError('Please enter a valid 10-digit Mobile Number');
            return;
        }

        const cleanEmail = (formData.email || '').trim().toLowerCase();
        if (!cleanEmail) {
            setError('Please enter your Email Address');
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match. Please verify your password');
            return;
        }

        if (!formData.agreeTerms) {
            setError('You must accept the Terms & Conditions to create an account');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name.trim(),
                phone: cleanPhone,
                email: cleanEmail,
                password: formData.password,
                gender: formData.gender
            });

            setSuccessMsg('✨ Account Ready! Welcome to Kiskintha Mens Wear...');

            setTimeout(() => {
                navigate('/');
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed. Please check details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card shadow-gold">
                    <div className="auth-header">
                        <div className="brand-logo">👑</div>
                        <h2>Create Account</h2>
                        <p className="subtitle">Kiskintha Mens Wear — Premium Collection</p>
                    </div>

                    {user && (
                        <div className="alert alert-info" style={{ marginBottom: '16px', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                            ℹ️ You are currently signed in as <strong>{user.name}</strong>. Create a new account below or <Link to="/" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>continue to Store</Link>.
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '16px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name <span className="req">*</span></label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number <span className="req">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="10-digit mobile number (e.g. 9876543210)"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={15}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address <span className="req">*</span></label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password <span className="req">*</span></label>
                            <div className="password-input-wrap">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="form-control"
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
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

                        <div className="form-group">
                            <label>Confirm Password <span className="req">*</span></label>
                            <div className="password-input-wrap">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Gender (Optional)</label>
                            <select
                                name="gender"
                                className="form-control"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                />
                                <span>I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Kiskintha Mens Wear Terms: All orders subject to Cash on Delivery verification."); }}>Terms &amp; Conditions</a></span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-gold btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login" className="gold-link">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
