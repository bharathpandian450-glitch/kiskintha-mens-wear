import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [linenItems, setLinenItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [bestRes, linenRes] = await Promise.all([
          API.get('/products?bestseller=true&limit=4'),
          API.get('/products?subcategory=Linen Shirts&limit=4')
        ]);
        setBestsellers(bestRes.data.products || []);
        setLinenItems(linenRes.data.products || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Banner */}
      <section className="position-relative py-5 bg-dark border-bottom border-secondary overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-gold text-dark text-uppercase mb-3 px-3 py-2 fw-bold">
                SPRING / SUMMER 2026 LINEN COLLECTION
              </span>
              <h1 className="display-4 font-heading text-light fw-bold mb-3">
                LUXURY <span className="text-gold">MEN'S FASHION</span> REDEFINED
              </h1>
              <p className="text-muted lead mb-4">
                Explore 130 unique handcrafted shirts, jeans, tailored trousers, t-shirts, and matching party group shirts. Designed exclusively for men.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/shirts" className="btn btn-gold btn-lg px-4">
                  Shop Linen Shirts <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/shop" className="btn btn-outline-light btn-lg px-4">
                  Explore Full Catalog (130)
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="kmw-card p-2 shadow-lg">
                    <img
                      src="/picture/linen 1.jpg"
                      alt="Pure Linen Shirt"
                      className="img-fluid rounded"
                      style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                    />
                    <div className="p-2 text-center">
                      <span className="badge bg-gold text-dark mb-1">Local Linen Picture #1</span>
                      <h6 className="text-light small mb-0 fw-bold">Pure Linen Summer Shirt</h6>
                    </div>
                  </div>
                </div>
                <div className="col-6 mt-4">
                  <div className="kmw-card p-2 shadow-lg">
                    <img
                      src="/picture/linen 2.jpg"
                      alt="Full Sleeve Linen Shirt"
                      className="img-fluid rounded"
                      style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                    />
                    <div className="p-2 text-center">
                      <span className="badge bg-gold text-dark mb-1">Local Linen Picture #2</span>
                      <h6 className="text-light small mb-0 fw-bold">Executive Linen Shirt</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Linen Shirts Showcase (Local Desktop Pictures) */}
      <section className="py-5 bg-dark bg-opacity-50">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="badge bg-gold text-dark text-uppercase mb-1">FEATURED LOCAL ASSETS</span>
              <h3 className="font-heading text-light mb-0">PREMIUM LINEN COLLECTION</h3>
              <p className="text-muted small mb-0">Featuring images from desktop/kiskintha mens wear/picture</p>
            </div>
            <Link to="/shop?category=shirts&subcategory=Linen Shirts" className="text-gold fw-bold text-decoration-none">
              View All Linen Shirts &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-gold" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {linenItems.map((prod) => (
                <div key={prod.id} className="col-lg-3 col-md-6 col-sm-6">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="font-heading text-light fw-bold">SHOP BY CATEGORY</h2>
            <p className="text-muted">Exclusively Men's Wear - 130 Unique Products</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <Link to="/shirts" className="text-decoration-none">
                <div className="kmw-card p-4 text-center border-secondary h-100">
                  <img src="/picture/linen 1.jpg" alt="Shirts" className="img-fluid rounded mb-3" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                  <h4 className="font-heading text-gold mb-1">SHIRTS</h4>
                  <p className="text-muted small">Formal, Casual, Linen, Denim & Checked (30 Items)</p>
                </div>
              </Link>
            </div>

            <div className="col-lg-4 col-md-6">
              <Link to="/pants" className="text-decoration-none">
                <div className="kmw-card p-4 text-center border-secondary h-100">
                  <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop" alt="Pants" className="img-fluid rounded mb-3" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                  <h4 className="font-heading text-gold mb-1">PANTS</h4>
                  <p className="text-muted small">Jeans, Chinos, Cargo & Stretch Pants (25 Items)</p>
                </div>
              </Link>
            </div>

            <div className="col-lg-4 col-md-6">
              <Link to="/trousers" className="text-decoration-none">
                <div className="kmw-card p-4 text-center border-secondary h-100">
                  <img src="https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&auto=format&fit=crop" alt="Trousers" className="img-fluid rounded mb-3" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                  <h4 className="font-heading text-gold mb-1">TROUSERS</h4>
                  <p className="text-muted small">Formal Suit Trousers & Office Wear (25 Items)</p>
                </div>
              </Link>
            </div>

            <div className="col-lg-6 col-md-6">
              <Link to="/t-shirts" className="text-decoration-none">
                <div className="kmw-card p-4 text-center border-secondary h-100">
                  <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop" alt="T-Shirts" className="img-fluid rounded mb-3" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                  <h4 className="font-heading text-gold mb-1">T-SHIRTS</h4>
                  <p className="text-muted small">Oversized, Polo, V-Neck & Graphic Tees (25 Items)</p>
                </div>
              </Link>
            </div>

            <div className="col-lg-6 col-md-12">
              <Link to="/group-shirts" className="text-decoration-none">
                <div className="kmw-card p-4 text-center border-secondary h-100">
                  <img src="/picture/linen 3.jpg" alt="Group Shirts" className="img-fluid rounded mb-3" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                  <h4 className="font-heading text-gold mb-1">GROUP SHIRTS</h4>
                  <p className="text-muted small">Matching Check, Print & Party Shirts for Groomsmen & Teams (25 Items)</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h3 className="font-heading text-light mb-0">BESTSELLER COLLECTION</h3>
              <p className="text-muted small mb-0">Top-rated items loved by customers</p>
            </div>
            <Link to="/shop?bestseller=true" className="text-gold fw-bold text-decoration-none">
              View All Bestsellers &rarr;
            </Link>
          </div>

          <div className="row g-4">
            {bestsellers.map((prod) => (
              <div key={prod.id} className="col-lg-3 col-md-6 col-sm-6">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
