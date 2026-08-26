import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        agreeTerms: false
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

        if (!formData.phone.trim()) {
            setError('Please enter your Mobile Number');
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone.trim())) {
            setError('Mobile Number must be a valid 10-digit phone number');
            return;
        }

        if (!formData.email.trim()) {
            setError('Please enter your Email Address');
            return;
        }

        if (formData.password.length < 6) {
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
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                password: formData.password,
                gender: formData.gender
            });

            setSuccessMsg('✨ Account Ready! Logging in...');

            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Email or Mobile may already exist.');
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
                                placeholder="10-digit mobile number"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength={10}
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
