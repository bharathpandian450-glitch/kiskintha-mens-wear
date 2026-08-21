import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { fullName, mobile, email, password, confirmPassword } = formData;

    if (!fullName || !mobile || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!MOBILE_REGEX.test(mobile.trim())) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Confirm Password does not match Password.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        name: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        password,
        confirmPassword
      });

      setSuccessMsg(res.message || 'Registration Successful! Redirecting to Sign In...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Email or Mobile may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 my-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="kmw-card p-4 p-md-5 border-secondary shadow-lg">
              <div className="text-center mb-4">
                <h4 className="font-heading text-light mb-1 fw-bold">
                  KISKINTHA <span className="text-gold">MENS WEAR</span>
                </h4>
                <h2 className="font-heading text-gold fs-2 mb-2 fw-bold">
                  CREATE YOUR ACCOUNT
                </h2>
                <p className="text-muted small fw-medium">
                  Join our exclusive luxury men's fashion club
                </p>
              </div>

              {errorMsg && <div className="alert alert-danger mb-4 fw-bold">{errorMsg}</div>}
              {successMsg && <div className="alert alert-success mb-4 fw-bold"><i className="bi bi-check-circle-fill me-2"></i>{successMsg}</div>}

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label className="form-label">Full Name *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person-badge-fill"></i>
                    </span>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control form-control-dark"
                      placeholder="e.g. Bharath Pandian"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="mb-3">
                  <label className="form-label">Mobile Number * (10 Digits)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone-fill"></i>
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength="10"
                      className="form-control form-control-dark"
                      placeholder="9876543210"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope-fill"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-dark"
                      placeholder="bharath@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label">Password * (Min 6 Chars)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-dark"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label">Confirm Password *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-shield-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-dark"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-gold btn-lg w-100 mb-3" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="text-center text-muted fs-6">
                Already have an account?{' '}
                <Link to="/login" className="text-gold fw-bold text-decoration-underline ms-1">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
