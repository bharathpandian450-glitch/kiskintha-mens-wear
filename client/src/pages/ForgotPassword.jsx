import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !newPassword || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Confirm Password does not match New Password.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email: email.trim(), newPassword, confirmPassword });
      setSuccessMsg(res.message || 'Password reset successful! Redirecting to Sign In...');

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Password reset failed. Verify your registered email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 my-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="kmw-card p-4 p-md-5 border-secondary shadow-lg">
              <div className="text-center mb-4">
                <h4 className="font-heading text-light mb-1 fw-bold">
                  KISKINTHA <span className="text-gold">MENS WEAR</span>
                </h4>
                <h2 className="font-heading text-gold fs-2 mb-2 fw-bold">
                  RESET PASSWORD
                </h2>
                <p className="text-muted small fw-medium">
                  Enter your registered email and choose a new password
                </p>
              </div>

              {errorMsg && <div className="alert alert-danger mb-4 fw-bold">{errorMsg}</div>}
              {successMsg && <div className="alert alert-success mb-4 fw-bold"><i className="bi bi-check-circle-fill me-2"></i>{successMsg}</div>}

              <form onSubmit={handleSubmit}>
                {/* Registered Email */}
                <div className="mb-3">
                  <label className="form-label">Registered Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope-fill"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-dark"
                      placeholder="user@kiskintha.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label">New Password * (Min 6 Chars)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-dark"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label">Confirm New Password *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-shield-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control form-control-dark"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold btn-lg w-100 mb-3" disabled={loading}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>

              <div className="text-center text-muted fs-6">
                Remember your password?{' '}
                <Link to="/login" className="text-gold fw-bold text-decoration-underline ms-1">
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
