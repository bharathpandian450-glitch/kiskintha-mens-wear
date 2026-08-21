import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="kmw-footer pt-5 pb-3 text-light">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="font-heading text-gold mb-3 fw-bold">
              KISKINTHA <span className="text-light">MENS WEAR</span>
            </h4>
            <p className="text-muted small pe-lg-4">
              Your premier destination for exclusive men's clothing. Offering 130 unique, high-fashion products across Shirts, Pants, Trousers, T-Shirts, and Group Shirts.
            </p>
            <div className="d-flex gap-3 text-gold fs-5 mt-3">
              <i className="bi bi-facebook me-2"></i>
              <i className="bi bi-instagram me-2"></i>
              <i className="bi bi-twitter-x me-2"></i>
              <i className="bi bi-whatsapp"></i>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-gold font-heading mb-3">SHOP CATEGORIES</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
              <li><Link to="/shirts" className="text-decoration-none text-muted">Shirts (30)</Link></li>
              <li><Link to="/pants" className="text-decoration-none text-muted">Pants (25)</Link></li>
              <li><Link to="/trousers" className="text-decoration-none text-muted">Trousers (25)</Link></li>
              <li><Link to="/t-shirts" className="text-decoration-none text-muted">T-Shirts (25)</Link></li>
              <li><Link to="/group-shirts" className="text-decoration-none text-muted">Group Shirts (25)</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-gold font-heading mb-3">POPULAR TYPES</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-0">
              <li><Link to="/shop?category=shirts&subcategory=Linen+Shirts" className="text-gold text-decoration-underline fw-bold">Linen Shirts (Local Pics)</Link></li>
              <li><Link to="/shop?category=shirts&subcategory=Formal+Shirts" className="text-decoration-none text-muted">Formal Shirts</Link></li>
              <li><Link to="/shop?category=pants&subcategory=Jeans" className="text-decoration-none text-muted">Raw Denim Jeans</Link></li>
              <li><Link to="/shop?category=t-shirts&subcategory=Polo+T-Shirts" className="text-decoration-none text-muted">Polo T-Shirts</Link></li>
              <li><Link to="/shop?category=group-shirts&subcategory=Party+Wear+Group+Shirts" className="text-decoration-none text-muted">Wedding Group Shirts</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-gold font-heading mb-3">CUSTOMER SUPPORT</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-3">
              <li><i className="bi bi-geo-alt-fill text-gold me-2"></i> Main Bazaar Road, Chennai, TN</li>
              <li><i className="bi bi-telephone-fill text-gold me-2"></i> +91 98765 43210</li>
              <li><i className="bi bi-envelope-fill text-gold me-2"></i> support@kiskintha.com</li>
              <li><i className="bi bi-truck text-gold me-2"></i> Cash on Delivery Available</li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} Kiskintha Mens Wear. All Rights Reserved. Exclusively for Men's Fashion.
          </p>
          <div className="d-flex gap-3">
            <Link to="/about" className="text-muted text-decoration-none">About Us</Link>
            <Link to="/contact" className="text-muted text-decoration-none">Contact Us</Link>
            <Link to="/admin/login" className="text-gold text-decoration-none fw-bold">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
