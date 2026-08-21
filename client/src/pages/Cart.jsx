import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const { cartItems, subtotal, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const deliveryCharge = subtotal > 1499 || cartItems.length === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-5 my-4">
        <div className="container text-center">
          <div className="kmw-card p-5 border-secondary shadow-lg col-md-8 mx-auto">
            <i className="bi bi-bag-x text-gold display-1 mb-3 d-block"></i>
            <h2 className="font-heading text-light mb-2 fw-bold">YOUR BAG IS EMPTY</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added any luxury men's clothing items to your bag yet.
            </p>
            <Link to="/shop" className="btn btn-gold btn-lg px-4">
              Explore Catalog (130 Items) &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
          <h2 className="font-heading text-light mb-0">SHOPPING BAG ({cartItems.length} Items)</h2>
          <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
            <i className="bi bi-trash me-1"></i> Clear Bag
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {cartItems.map((item) => (
                <div key={item.id} className="kmw-card p-3 border-secondary d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                  <img
                    src={item.product_image || '/picture/linen 1.jpg'}
                    alt={item.product_name}
                    className="rounded"
                    style={{ width: '90px', height: '110px', objectFit: 'cover' }}
                  />

                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-gold text-dark small">{item.category_name || 'Men'}</span>
                      {item.subcategory && <span className="badge bg-secondary text-light small">{item.subcategory}</span>}
                    </div>

                    <h6 className="font-heading text-light mb-1 fw-bold">{item.product_name}</h6>
                    <div className="text-muted small mb-2">
                      Size: <span className="text-light fw-bold me-3">{item.size}</span> | Color: <span className="text-light fw-bold">{item.color}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-5 text-gold fw-bold">₹{item.price.toLocaleString()}</span>
                      {item.original_price > item.price && (
                        <span className="text-muted text-decoration-line-through small">₹{item.original_price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Delete Actions */}
                  <div className="d-flex flex-sm-column justify-content-between align-items-end gap-2">
                    <div className="input-group input-group-dark input-group-sm" style={{ width: '110px' }}>
                      <button className="btn btn-outline-secondary text-light" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <input type="text" className="form-control text-center bg-dark text-light border-secondary" value={item.quantity} readOnly />
                      <button className="btn btn-outline-secondary text-light" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>

                    <button className="btn btn-link text-danger p-0 text-decoration-none small" onClick={() => removeFromCart(item.id)}>
                      <i className="bi bi-trash me-1"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="kmw-card p-4 border-secondary sticky-top" style={{ top: '100px' }}>
              <h5 className="font-heading text-gold mb-3 fw-bold">ORDER SUMMARY</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-light fw-bold">₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery Charges</span>
                <span className={deliveryCharge === 0 ? "text-success fw-bold" : "text-light fw-bold"}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Payment Mode</span>
                <span className="badge bg-gold text-dark fw-bold">Cash on Delivery</span>
              </div>

              <hr className="border-secondary mb-3" />

              <div className="d-flex justify-content-between mb-4">
                <span className="font-heading text-light fs-5 fw-bold">Total Amount</span>
                <span className="font-heading text-gold fs-4 fw-bold">₹{grandTotal.toLocaleString()}</span>
              </div>

              <button className="btn btn-gold btn-lg w-100 mb-3" onClick={handleProceedToCheckout}>
                Proceed to Checkout &rarr;
              </button>

              <div className="bg-secondary bg-opacity-25 p-2 rounded text-center small text-muted">
                <i className="bi bi-shield-lock-fill text-gold me-1"></i> 100% Secure Checkout & Free COD Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
