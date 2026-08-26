import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Kiskintha Mens Wear</h4>
                        <p>Your one-stop destination for premium men's clothing. We offer the best quality T-Shirts, Shirts, Jeans, Trousers, and more at affordable prices.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>📧 bharathpandian450@gmail.com</li>
                            <li>📞 +91 7094153640</li>
                            <li>📍 Chennai, Tamil Nadu, India</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Kiskintha Mens Wear. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
