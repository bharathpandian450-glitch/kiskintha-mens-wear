import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import API from '../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const isNewOrder = location.state?.newOrder;

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading order details...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3 className="font-heading text-light mb-3">Order Not Found</h3>
        <Link to="/orders" className="btn btn-gold">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        {isNewOrder && (
          <div className="alert alert-success p-4 mb-4 border-success bg-dark shadow-lg">
            <h4 className="font-heading text-success mb-2 fw-bold">
              <i className="bi bi-check-circle-fill me-2"></i> CONGRATULATIONS! ORDER PLACED SUCCESSFULLY!
            </h4>
            <p className="mb-0 text-light">
              Your Cash on Delivery order <strong>#{order.order_number}</strong> has been received and is being processed by Kiskintha Mens Wear team.
            </p>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
          <div>
            <span className="badge bg-gold text-dark text-uppercase me-2">{order.payment_method || 'Cash on Delivery'}</span>
            <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>{order.status}</span>
            <h2 className="font-heading text-light mb-0 mt-1">ORDER #{order.order_number}</h2>
          </div>

          <Link to="/orders" className="btn btn-outline-secondary text-light btn-sm">
            &larr; Back to My Orders
          </Link>
        </div>

        <div className="row g-4">
          {/* Order Items */}
          <div className="col-lg-8">
            <div className="kmw-card p-4 border-secondary mb-4">
              <h5 className="font-heading text-gold mb-3 fw-bold">PURCHASED ITEMS</h5>

              <div className="d-flex flex-column gap-3">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="p-3 bg-dark rounded border border-secondary d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="font-heading text-light mb-1 fw-bold">{item.product_name}</h6>
                      <span className="text-muted small">
                        Size: <strong className="text-light">{item.size}</strong> | Color: <strong className="text-light">{item.color}</strong> | Qty: <strong className="text-gold">{item.quantity}</strong>
                      </span>
                    </div>
                    <span className="fs-5 text-gold fw-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Tracking Progress Tracker */}
            <div className="kmw-card p-4 border-secondary">
              <h5 className="font-heading text-gold mb-3 fw-bold">DELIVERY TRACKER</h5>
              <div className="d-flex justify-content-between text-center small position-relative py-3">
                <div className="text-gold fw-bold">
                  <i className="bi bi-check-circle-fill fs-4 d-block mb-1"></i> Order Placed
                </div>
                <div className={['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-gold fw-bold' : 'text-muted'}>
                  <i className="bi bi-box-seam fs-4 d-block mb-1"></i> Packed
                </div>
                <div className={['Shipped', 'Out for Delivery', 'Delivered'].includes(order.status) ? 'text-gold fw-bold' : 'text-muted'}>
                  <i className="bi bi-truck fs-4 d-block mb-1"></i> Shipped
                </div>
                <div className={order.status === 'Delivered' ? 'text-success fw-bold' : 'text-muted'}>
                  <i className="bi bi-house-door-fill fs-4 d-block mb-1"></i> Delivered (COD)
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="col-lg-4">
            <div className="kmw-card p-4 border-secondary mb-4">
              <h5 className="font-heading text-gold mb-3 fw-bold">SHIPPING ADDRESS</h5>
              <p className="text-light mb-1 fw-bold">{order.shipping_name}</p>
              <p className="text-muted small mb-1">{order.shipping_phone}</p>
              <p className="text-muted small mb-1">{order.shipping_email}</p>
              <p className="text-muted small mb-0">{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
            </div>

            <div className="kmw-card p-4 border-secondary">
              <h5 className="font-heading text-gold mb-3 fw-bold">PAYMENT BREAKDOWN</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="text-light fw-bold">₹{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery</span>
                <span className="text-success fw-bold">{parseFloat(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
              </div>
              <hr className="border-secondary mb-2" />
              <div className="d-flex justify-content-between fs-5 fw-bold text-gold">
                <span>Total Amount (COD)</span>
                <span>₹{parseFloat(order.total_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
