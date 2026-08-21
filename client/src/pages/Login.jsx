import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginId || !password) {
      setErrorMsg('Please enter your Email or Mobile Number and Password.');
      return;
    }

    try {
      setLoading(true);
      await login(loginId, password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Invalid Email/Mobile or Password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setLoginId('user@kiskintha.com');
    setPassword('user123');
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
                  WELCOME BACK
                </h2>
                <p className="text-muted small fw-medium">
                  Sign in to access your account & shopping bag
                </p>
              </div>

              {errorMsg && <div className="alert alert-danger mb-4 fw-bold">{errorMsg}</div>}

              <form onSubmit={handleSubmit}>
                {/* Email or Mobile Input */}
                <div className="mb-3">
                  <label className="form-label">Email Address or Mobile Number *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      placeholder="user@kiskintha.com or 9876543210"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control form-control-dark"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Options: Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMeCheck"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label ms-1" htmlFor="rememberMeCheck">
                      Remember Me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-gold text-decoration-none fw-bold small">
                    Forgot Password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button type="submit" className="btn btn-gold btn-lg w-100 mb-3" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Demo Filler */}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100 mb-4 text-light"
                  onClick={fillDemoCustomer}
                >
                  ⚡ Fill Demo Customer Credentials
                </button>
              </form>

              <div className="text-center text-muted fs-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold fw-bold text-decoration-underline ms-1">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
