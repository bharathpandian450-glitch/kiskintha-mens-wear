import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top kmw-navbar">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center me-4" to="/">
          <span className="font-heading fs-3 text-gold fw-bold tracking-wide">
            KISKINTHA <span className="text-light fs-4 fw-normal">MENS WEAR</span>
          </span>
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#kmwNavbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="kmwNavbarContent">
          {/* Main Category Nav Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item">
              <Link className={`nav-link px-2 ${location.pathname === '/' ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-2 ${location.pathname === '/shirts' ? 'active' : ''}`} to="/shirts">
                Shirts
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-2 ${location.pathname === '/pants' ? 'active' : ''}`} to="/pants">
                Pants
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-2 ${location.pathname === '/trousers' ? 'active' : ''}`} to="/trousers">
                Trousers
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-2 ${location.pathname === '/t-shirts' ? 'active' : ''}`} to="/t-shirts">
                T-Shirts
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-2 ${location.pathname === '/group-shirts' ? 'active' : ''}`} to="/group-shirts">
                Group Shirts
              </Link>
            </li>
            <li className="nav-item ms-lg-2">
              <Link className={`nav-link px-2 text-gold ${location.pathname === '/shop' ? 'active' : ''}`} to="/shop">
                <i className="bi bi-grid-fill me-1"></i> All Catalog (130)
              </Link>
            </li>
          </ul>

          {/* Search Form */}
          <form className="d-flex me-3 my-2 my-lg-0" onSubmit={handleSearchSubmit} style={{ maxWidth: '240px' }}>
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control form-control-dark"
                placeholder="Search Shirts, Jeans, Linen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-gold" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* User & Bag Icons */}
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="btn btn-outline-gold position-relative btn-sm px-3">
              <i className="bi bi-bag-fill me-1"></i> Bag
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark text-light border-secondary dropdown-toggle btn-sm d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle text-gold fs-6"></i>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                  <li>
                    <Link className="dropdown-item" to="/account">
                      <i className="bi bi-person me-2 text-gold"></i> My Account
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="bi bi-box-seam me-2 text-gold"></i> My Orders
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <>
                      <li><hr className="dropdown-divider border-secondary" /></li>
                      <li>
                        <Link className="dropdown-item text-warning" to="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2"></i> Admin Panel
                        </Link>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm fw-bold">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-gold btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
