import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'L');
  const [addedToast, setAddedToast] = useState(false);

  const price = product.discount_price || product.price;
  const originalPrice = product.price;
  const discountPercent = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const primaryImg = (product.images && product.images[0]) || product.image || '/picture/linen 1.jpg';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const chosenColor = product.colors ? product.colors[0] : 'Standard';
    addToCart(product, selectedSize, chosenColor, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="kmw-card h-100 d-flex flex-column position-relative shadow-sm">
      <Link to={`/product/${product.id}`} className="text-decoration-none">
        <div className="product-img-wrapper">
          {product.is_bestseller === 1 && <span className="badge-tag badge-bestseller">Bestseller</span>}
          {product.is_new === 1 && !product.is_bestseller && <span className="badge-tag badge-new">New</span>}
          {discountPercent > 0 && <span className="badge-discount">-{discountPercent}% OFF</span>}
          
          <img src={primaryImg} alt={product.name} className="img-fluid primary" />
        </div>
      </Link>

      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Category & Subcategory Tags */}
        <div className="d-flex justify-content-between align-items-center mb-1">
          <div className="d-flex align-items-center gap-1 overflow-hidden" style={{ maxWidth: '70%' }}>
            <span className="badge bg-gold text-dark text-uppercase small" style={{ fontSize: '0.65rem' }}>
              {product.category_name || 'Men'}
            </span>
            <span className="text-muted small">→</span>
            <span className="badge bg-secondary text-light text-truncate small" style={{ fontSize: '0.65rem' }} title={product.subcategory}>
              {product.subcategory}
            </span>
          </div>

          <StarRating rating={product.rating || 4.5} />
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="text-decoration-none text-light">
          <h6 className="fw-semibold text-truncate mb-2" title={product.name} style={{ fontSize: '0.95rem' }}>
            {product.name}
          </h6>
        </Link>

        {/* Price & Actions */}
        <div className="mt-auto">
          <div className="d-flex align-items-baseline gap-2 mb-2">
            <span className="fs-5 fw-bold text-gold">₹{price.toLocaleString()}</span>
            {discountPercent > 0 && (
              <span className="text-muted text-decoration-line-through small">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Size Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="d-flex gap-1 mb-3">
              {product.sizes.slice(0, 5).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`btn btn-sm py-0 px-2 small ${selectedSize === sz ? 'btn-gold' : 'btn-outline-secondary text-muted'}`}
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${addedToast ? 'btn-success' : 'btn-gold'}`}
            onClick={handleQuickAdd}
          >
            <i className={`bi ${addedToast ? 'bi-check-lg' : 'bi-bag-plus'}`}></i>
            <span>{addedToast ? 'Added to Cart!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
