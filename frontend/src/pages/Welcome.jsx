import { Link } from 'react-router-dom';
import CrownLogo from '../components/CrownLogo';

function Welcome() {
    return (
        <div className="welcome-page">
            <div className="welcome-hero-overlay"></div>
            <div className="welcome-container">
                <div className="welcome-card">
                    <div className="welcome-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <CrownLogo layout="vertical" iconSize={46} showSubtext={false} />
                        <h1 className="welcome-title" style={{ margin: '4px 0 0' }}>Kiskintha Mens Wear</h1>
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
