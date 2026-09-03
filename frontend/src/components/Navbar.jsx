import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/welcome');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>👑</span>
                    <span style={{ fontWeight: '800', fontSize: '20px', color: '#111111', letterSpacing: '-0.5px' }}>
                        Kiskintha Mens Wear
                    </span>
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>

                <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>

                    {user && (user.role === 'owner' || user.role === 'admin') && (
                        <Link to="/owner" className="owner-nav-link" onClick={() => setMobileMenuOpen(false)} style={{ color: '#b45309', fontWeight: '700' }}>
                            👑 Store Owner Portal
                        </Link>
                    )}

                    {/* Show Cart and My Orders for Customers */}
                    {(!user || (user.role !== 'owner' && user.role !== 'admin')) && (
                        <>
                            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                                🛍️ My Orders
                            </Link>
                            <Link to="/cart" className="cart-link" onClick={() => setMobileMenuOpen(false)}>
                                🛒 Cart
                                {getCartCount() > 0 && (
                                    <span className="cart-badge">{getCartCount()}</span>
                                )}
                            </Link>
                        </>
                    )}

                    {user && (
                        <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="user-greeting-badge" style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                                border: '1px solid #fde68a',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: '#92400e',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <span>👤</span> Welcome, {user.name.split(' ')[0]}
                            </div>

                            {user.role !== 'owner' && (
                                <Link to="/settings" className="btn btn-sm" style={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', fontWeight: '600' }} onClick={() => setMobileMenuOpen(false)}>
                                    ⚙️ Settings
                                </Link>
                            )}

                            <button className="btn btn-sm btn-secondary" style={{ background: '#111827', color: '#ffffff' }} onClick={handleLogout}>
                                🚪 Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
