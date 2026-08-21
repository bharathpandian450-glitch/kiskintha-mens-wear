import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MyAccount = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="py-5">
      <div className="container">
        <h2 className="font-heading text-light mb-4 pb-2 border-bottom border-secondary">
          MY ACCOUNT PROFILE
        </h2>

        <div className="row g-4">
          <div className="col-md-5">
            <div className="kmw-card p-4 border-secondary text-center">
              <div className="mb-3">
                <i className="bi bi-person-circle text-gold display-1"></i>
              </div>
              <h4 className="font-heading text-light mb-1 fw-bold">{user?.name}</h4>
              <span className="badge bg-gold text-dark text-uppercase mb-3 px-3 py-1">
                {user?.role === 'admin' ? 'Store Administrator' : 'Privileged Customer'}
              </span>

              <div className="text-start bg-dark p-3 rounded border border-secondary mb-4 small">
                <div className="mb-2">
                  <span className="text-muted">Registered Email:</span>
                  <div className="text-light fw-bold">{user?.email}</div>
                </div>
                <div className="mb-2">
                  <span className="text-muted">Mobile Number:</span>
                  <div className="text-light fw-bold">{user?.mobile}</div>
                </div>
                <div>
                  <span className="text-muted">Account Status:</span>
                  <div className="text-success fw-bold">Active Verified Account</div>
                </div>
              </div>

              <button className="btn btn-outline-danger w-100" onClick={logout}>
                <i className="bi bi-box-arrow-right me-2"></i> Sign Out of Account
              </button>
            </div>
          </div>

          <div className="col-md-7">
            <div className="kmw-card p-4 border-secondary mb-4">
              <h5 className="font-heading text-gold mb-3 fw-bold">QUICK LINKS</h5>
              <div className="d-flex flex-column gap-3">
                <Link to="/orders" className="btn btn-dark border-secondary text-light text-start p-3 d-flex justify-content-between align-items-center text-decoration-none">
                  <div>
                    <h6 className="mb-1 text-gold fw-bold"><i className="bi bi-box-seam me-2"></i> My Order History</h6>
                    <span className="text-muted small">View all your placed Cash on Delivery orders and track delivery status</span>
                  </div>
                  <i className="bi bi-chevron-right text-gold"></i>
                </Link>

                <Link to="/cart" className="btn btn-dark border-secondary text-light text-start p-3 d-flex justify-content-between align-items-center text-decoration-none">
                  <div>
                    <h6 className="mb-1 text-gold fw-bold"><i className="bi bi-bag-check me-2"></i> My Shopping Bag</h6>
                    <span className="text-muted small">View active items saved in your personal shopping bag</span>
                  </div>
                  <i className="bi bi-chevron-right text-gold"></i>
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="btn btn-warning text-dark text-start p-3 d-flex justify-content-between align-items-center text-decoration-none fw-bold">
                    <div>
                      <h6 className="mb-1"><i className="bi bi-speedometer2 me-2"></i> Admin Management Portal</h6>
                      <span className="small opacity-75">Access catalog product manager, subcategories, orders & customers</span>
                    </div>
                    <i className="bi bi-chevron-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
