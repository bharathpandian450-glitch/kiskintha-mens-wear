import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="py-5">
      <div className="container">
        <div className="row align-items-center g-5 mb-5">
          <div className="col-lg-6">
            <span className="badge bg-gold text-dark text-uppercase mb-2 px-3 py-1">THE HERITAGE OF ELEGANCE</span>
            <h1 className="font-heading text-light display-5 fw-bold mb-3">
              ABOUT <span className="text-gold">KISKINTHA MENS WEAR</span>
            </h1>
            <p className="text-muted lead mb-4">
              Kiskintha Mens Wear is an exclusive fashion brand dedicated 100% to modern men's clothing.
            </p>
            <p className="text-muted mb-4">
              Founded with a passion for premium craftsmanship, we curate 130 unique, high-fashion products across 5 distinct main categories: <strong>Shirts, Pants, Trousers, T-Shirts, and Group Shirts</strong>. Every shirt and pair of pants is tailored to provide supreme comfort and confidence.
            </p>
            <Link to="/shop" className="btn btn-gold btn-lg px-4">
              Explore Our Collection (130 Items) &rarr;
            </Link>
          </div>

          <div className="col-lg-6">
            <div className="kmw-card p-3 border-secondary">
              <img
                src="/picture/linen 1.jpg"
                alt="Kiskintha Mens Wear Brand Heritage"
                className="img-fluid rounded shadow"
                style={{ height: '400px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
