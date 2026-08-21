import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.mobile || '',
    email: user?.email || '',
    address: '123 Main Street, Sector 4',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryCharge = subtotal > 1499 || cartItems.length === 0 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setErrorMsg('Please fill in all required shipping details.');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/orders', {
        items: cartItems,
        subtotal,
        deliveryCharge,
        totalAmount: grandTotal,
        shippingDetails: formData
      });

      clearCart();
      navigate(`/orders/${res.data.orderId || 1}`, { state: { newOrder: true } });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <h2 className="font-heading text-light mb-4 pb-2 border-bottom border-secondary">
          CHECKOUT - CASH ON DELIVERY (COD)
        </h2>

        {errorMsg && <div className="alert alert-danger mb-4 fw-bold">{errorMsg}</div>}

        <div className="row g-4">
          {/* Shipping Address Form */}
          <div className="col-lg-7">
            <div className="kmw-card p-4 border-secondary">
              <h4 className="font-heading text-gold mb-3 fw-bold">SHIPPING ADDRESS</h4>

              <form onSubmit={handleSubmitOrder}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="tel"
                      className="form-control form-control-dark"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control form-control-dark"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Street Address & Landmark *</label>
                    <textarea
                      rows="3"
                      className="form-control form-control-dark"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gold bg-opacity-10 border border-gold rounded">
                  <h6 className="font-heading text-gold mb-1 fw-bold">
                    <i className="bi bi-cash-stack me-2"></i> Payment Method: Cash on Delivery (COD Only)
                  </h6>
                  <p className="text-muted small mb-0">
                    Pay via Cash, UPI, or Card upon delivery to your doorstep. No advance payment required.
                  </p>
                </div>

                <button type="submit" className="btn btn-gold btn-lg w-100 mt-4" disabled={loading}>
                  {loading ? 'Processing Order...' : 'Confirm & Place COD Order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Items Preview */}
          <div className="col-lg-5">
            <div className="kmw-card p-4 border-secondary">
              <h5 className="font-heading text-gold mb-3 fw-bold">BAG ITEMS ({cartItems.length})</h5>

              <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex align-items-center gap-3">
                    <img
                      src={item.product_image || '/picture/linen 1.jpg'}
                      alt={item.product_name}
                      className="rounded"
                      style={{ width: '55px', height: '65px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="text-light small mb-0 fw-bold">{item.product_name}</h6>
                      <span className="text-muted small">Qty: {item.quantity} | Size: {item.size}</span>
                    </div>
                    <span className="text-gold fw-bold small">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <hr className="border-secondary mb-3" />

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-light fw-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery</span>
                <span className="text-success fw-bold">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="d-flex justify-content-between fs-5 fw-bold text-gold mt-2">
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
