import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImg, setSelectedImg] = useState('');
  const [selectedSize, setSelectedSize] = useState('L');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}`);
      const data = res.data;
      setProduct(data);
      
      const pImg = (data.images && data.images[0]) || data.image || '/picture/linen 1.jpg';
      setSelectedImg(pImg);
      setSelectedSize(data.sizes ? data.sizes[0] : 'L');
      setSelectedColor(data.colors ? data.colors[0] : 'Standard');

      // Fetch related products in same category
      if (data.category_id) {
        const relRes = await API.get(`/products?category=${data.category_id}&limit=4`);
        setRelated((relRes.data.products || []).filter(p => p.id !== data.id));
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setToastMsg(`Added ${quantity} x "${product.name}" to Bag!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3 className="font-heading text-light mb-3">Product Not Found</h3>
        <Link to="/shop" className="btn btn-gold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const price = product.discount_price || product.price;
  const originalPrice = product.price;
  const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const allImages = (product.images && product.images.length > 0) ? product.images : [product.image || '/picture/linen 1.jpg'];

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-gold text-decoration-none">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/shop" className="text-gold text-decoration-none">Shop</Link></li>
            <li className="breadcrumb-item"><span className="text-muted">{product.category_name || 'Men'}</span></li>
            <li className="breadcrumb-item active text-light" aria-current="page">{product.subcategory}</li>
          </ol>
        </nav>

        {toastMsg && <div className="alert alert-success mb-4 fw-bold"><i className="bi bi-check-circle-fill me-2"></i>{toastMsg}</div>}

        <div className="row g-5 mb-5">
          {/* Gallery */}
          <div className="col-lg-6">
            <div className="kmw-card p-3 mb-3 border-secondary text-center">
              <img
                src={selectedImg}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>

            {allImages.length > 1 && (
              <div className="d-flex gap-2 overflow-auto">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn p-1 border ${selectedImg === imgUrl ? 'border-gold' : 'border-secondary'}`}
                    onClick={() => setSelectedImg(imgUrl)}
                  >
                    <img src={imgUrl} alt="Thumbnail" style={{ width: '70px', height: '80px', objectFit: 'cover' }} className="rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Info */}
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-gold text-dark text-uppercase">{product.category_name}</span>
              <span className="badge bg-secondary text-light">{product.subcategory}</span>
              {discountPercent > 0 && <span className="badge bg-danger">-{discountPercent}% OFF</span>}
            </div>

            <h1 className="font-heading text-light fw-bold mb-3">{product.name}</h1>

            <div className="d-flex align-items-center gap-3 mb-3">
              <StarRating rating={product.rating || 4.5} />
              <span className="text-muted small">({product.review_count || 18} Verified Buyer Reviews)</span>
              <span className="badge bg-success">In Stock ({product.stock_quantity || 45})</span>
            </div>

            <div className="d-flex align-items-baseline gap-3 mb-4">
              <h2 className="text-gold font-heading fw-bold mb-0">₹{price.toLocaleString()}</h2>
              {discountPercent > 0 && (
                <span className="fs-5 text-muted text-decoration-line-through">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="text-muted mb-4 lead" style={{ fontSize: '0.98rem' }}>
              {product.description}
            </p>

            <hr className="border-secondary mb-4" />

            {/* Size Options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <label className="form-label text-gold font-heading">Select Size</label>
                <div className="d-flex gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`btn ${selectedSize === sz ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <label className="form-label text-gold font-heading">Select Color Variant</label>
                <div className="d-flex gap-2">
                  {product.colors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      className={`btn btn-sm ${selectedColor === col ? 'btn-gold' : 'btn-outline-secondary text-light'}`}
                      onClick={() => setSelectedColor(col)}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="form-label text-gold font-heading">Quantity</label>
              <div className="input-group input-group-dark" style={{ width: '140px' }}>
                <button className="btn btn-outline-secondary text-light" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="text" className="form-control text-center bg-dark text-light border-secondary" value={quantity} readOnly />
                <button className="btn btn-outline-secondary text-light" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button type="button" className="btn btn-gold btn-lg w-100 mb-4" onClick={handleAddToCart}>
              <i className="bi bi-bag-plus-fill me-2"></i> Add {quantity} Item(s) to Shopping Bag
            </button>

            <div className="p-3 rounded border border-secondary bg-dark bg-opacity-50 small text-muted">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-truck text-gold fs-5"></i>
                <span className="text-light">100% Cash on Delivery Available Across India</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-arrow-counterclockwise text-gold fs-5"></i>
                <span className="text-light">Easy 7-Day Doorstep Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-5 pt-4 border-top border-secondary">
            <h3 className="font-heading text-light mb-4">YOU MAY ALSO LIKE</h3>
            <div className="row g-4">
              {related.map((relProd) => (
                <div key={relProd.id} className="col-lg-3 col-md-6 col-sm-6">
                  <ProductCard product={relProd} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
