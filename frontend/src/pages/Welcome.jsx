import { Link } from 'react-router-dom';

function Welcome() {
    return (
        <div className="welcome-page">
            <div className="welcome-hero-overlay"></div>
            <div className="welcome-container">
                <div className="welcome-card">
                    <div className="welcome-header">
                        <div className="brand-crown-icon">👑</div>
                        <h1 className="welcome-title">Kiskintha Mens Wear</h1>
                        <p className="welcome-subtitle">Premium Fashion &amp; Apparel</p>
                        <div className="gold-divider"></div>
                    </div>

                    <div className="welcome-body">
                        <p className="welcome-intro">
                            Welcome to Chennai's premier e-fashion destination. Experience curated clothing, exclusive discounts, and seamless shopping.
                        </p>

                        <div className="welcome-actions">
                            <Link to="/login" className="btn btn-gold btn-block btn-lg">
                                🔐 Sign In
                            </Link>
                            <Link to="/register" className="btn btn-outline-gold btn-block btn-lg">
                                📝 Create Account
                            </Link>
                        </div>
                    </div>

                    <div className="welcome-footer">
                        <div className="trust-badges">
                            <span>✨ 100% Genuine Quality</span>
                            <span>🚚 Fast COD Delivery</span>
                            <span>🛡️ Secure Shopping</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
