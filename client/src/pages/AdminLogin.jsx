import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await API.post('/admin/login', { email, password });
      
      localStorage.setItem('kmw_token', res.data.token);
      localStorage.setItem('kmw_user', JSON.stringify(res.data.admin));

      navigate('/admin/dashboard');
      window.location.reload();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Admin login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@kiskintha.com');
    setPassword('admin123');
  };

  return (
    <div className="py-5 my-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="kmw-card p-4 p-md-5 border-warning shadow-lg">
              <div className="text-center mb-4">
                <span className="badge bg-danger text-light mb-2 px-3 py-1">ADMINISTRATOR PORTAL</span>
                <h3 className="font-heading text-gold fw-bold mb-1">ADMIN LOGIN</h3>
                <p className="text-muted small">Kiskintha Control Center</p>
              </div>

              {errorMsg && <div className="alert alert-danger mb-4 fw-bold">{errorMsg}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Admin Email *</label>
                  <input
                    type="email"
                    className="form-control form-control-dark"
                    placeholder="admin@kiskintha.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Admin Password *</label>
                  <input
                    type="password"
                    className="form-control form-control-dark"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-warning text-dark btn-lg w-100 fw-bold mb-3" disabled={loading}>
                  {loading ? 'Authenticating Admin...' : 'Enter Admin Control Center'}
                </button>

                <button type="button" className="btn btn-outline-secondary btn-sm w-100 text-light" onClick={fillDemoAdmin}>
                  ⚡ Fill Demo Admin Credentials
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
