import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading order history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container">
        <h2 className="font-heading text-light mb-4 pb-2 border-bottom border-secondary">
          MY ORDER HISTORY
        </h2>

        {orders.length === 0 ? (
          <div className="kmw-card p-5 text-center border-secondary col-md-8 mx-auto">
            <i className="bi bi-box-seam text-gold display-1 mb-3 d-block"></i>
            <h3 className="font-heading text-light mb-2 fw-bold">NO ORDERS PLACED YET</h3>
            <p className="text-muted mb-4">You haven't placed any orders with Kiskintha Mens Wear yet.</p>
            <Link to="/shop" className="btn btn-gold px-4">
              Explore 130 Items & Place Your First COD Order &rarr;
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((ord) => (
              <div key={ord.id} className="kmw-card p-4 border-secondary">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3 pb-3 border-bottom border-secondary">
                  <div>
                    <span className="badge bg-gold text-dark mb-1">{ord.payment_method || 'Cash on Delivery'}</span>
                    <h5 className="font-heading text-light mb-0 fw-bold">ORDER #{ord.order_number}</h5>
                    <span className="text-muted small">Placed on: {new Date(ord.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="text-md-end">
                    <span className={`badge px-3 py-2 fs-6 mb-1 ${ord.status === 'Delivered' ? 'bg-success' : ord.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      {ord.status}
                    </span>
                    <div className="fs-4 text-gold fw-bold">₹{parseFloat(ord.total_amount).toLocaleString()}</div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    Shipping to: <strong className="text-light">{ord.shipping_name}</strong> ({ord.shipping_city})
                  </span>
                  <Link to={`/orders/${ord.id}`} className="btn btn-outline-gold btn-sm">
                    View Full Order Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
