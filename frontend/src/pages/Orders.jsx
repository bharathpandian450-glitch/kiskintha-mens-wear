import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API, { getImageUrl } from '../api';

const getImageSrc = (img) => {
    if (!img) return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80';
    return getImageUrl(img);
};

const statusColors = {
    'Pending': { bg: '#fef3c7', text: '#b45309', border: '#fde68a', icon: '⏳' },
    'Confirmed': { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', icon: '✅' },
    'Packed': { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff', icon: '📦' },
    'Shipped': { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe', icon: '🚚' },
    'Delivered': { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0', icon: '🎉' },
    'Cancelled': { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca', icon: '❌' }
};

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await API.get('/orders/my');
            setOrders(res.data || []);
        } catch (err) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setError('Your session has expired or is invalid. Please sign in to view your orders.');
            } else {
                setError(err.response?.data?.message || 'Failed to load your orders.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="orders-page" style={{ padding: '60px 20px', minHeight: '60vh' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '16px', color: '#64748b' }}>Loading your order history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page" style={{ padding: '60px 20px', minHeight: '60vh' }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', background: '#ffffff', padding: '40px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
                    <div className="alert alert-error" style={{ marginBottom: '20px' }}>{error}</div>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '700', borderRadius: '10px' }}>
                        Sign In Now →
                    </Link>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page" style={{ padding: '60px 20px', minHeight: '60vh' }}>
                <div className="container" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', background: '#ffffff', padding: '50px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ fontSize: '50px', marginBottom: '16px' }}>🛍️</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px' }}>No Orders Placed Yet</h2>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: '0 0 24px' }}>
                        Explore our collection of premium Full Hand & Half Hand Shirts, T-Shirts, Pants, and Trousers!
                    </p>
                    <Link to="/products" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '700', borderRadius: '10px' }}>
                        Browse Products →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page" style={{ padding: '40px 20px', background: '#f8fafc', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛍️ My Orders</h1>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                            Track your real-time order status and delivery updates
                        </p>
                    </div>
                    <Link to="/products" className="btn btn-secondary" style={{ background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: '700', fontSize: '13px' }}>
                        Continue Shopping →
                    </Link>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map(order => {
                        const statusKey = order.status || 'Pending';
                        const statusStyle = statusColors[statusKey] || statusColors['Pending'];
                        const formattedDate = order.created_at
                            ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                            : 'Recently';

                        return (
                            <div
                                key={order.id}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Order Header */}
                                <div style={{
                                    padding: '16px 20px',
                                    background: '#f8fafc',
                                    borderBottom: '1px solid #e2e8f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '12px'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ORDER PLACED</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{formattedDate}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>ORDER ID</div>
                                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#2563eb' }}>#{order.id}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>TOTAL AMOUNT</div>
                                        <div style={{ fontSize: '16px', fontWeight: '800', color: '#059669' }}>
                                            ₹{Number(order.total || 0).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                background: statusStyle.bg,
                                                color: statusStyle.text,
                                                border: `1px solid ${statusStyle.border}`,
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                fontWeight: '800',
                                                fontSize: '13px',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            <span>{statusStyle.icon}</span> {statusKey}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div style={{ padding: '20px' }}>
                                    {/* Items List */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                                        {(order.items || []).map((item, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '14px',
                                                    paddingBottom: '14px',
                                                    borderBottom: idx < (order.items || []).length - 1 ? '1px solid #f1f5f9' : 'none',
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <img
                                                        src={getImageSrc(item.image)}
                                                        alt={item.product_name || item.name}
                                                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0' }}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            const filename = (item.image || '').split('/').pop();
                                                            e.target.src = getImageUrl(filename);
                                                        }}
                                                    />
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                                                            {item.product_name || item.name || 'Kiskintha Item'}
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '4px', flexWrap: 'wrap' }}>
                                                            {item.category_name && (
                                                                <span style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                                                    🏷️ {item.category_name}
                                                                </span>
                                                            )}
                                                            {item.sleeve_type && item.sleeve_type !== 'N/A' && (
                                                                <span style={{
                                                                    background: item.sleeve_type === 'Half Hand' ? '#fef3c7' : '#f0fdf4',
                                                                    color: item.sleeve_type === 'Half Hand' ? '#b45309' : '#166534',
                                                                    border: item.sleeve_type === 'Half Hand' ? '1px solid #fde68a' : '1px solid #bbf7d0',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    fontWeight: '800'
                                                                }}>
                                                                    {item.sleeve_type === 'Half Hand' ? '👕 Half Hand' : '👔 Full Hand'}
                                                                </span>
                                                            )}
                                                            {item.color && (
                                                                <span style={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                                                    🎨 {item.color}
                                                                </span>
                                                            )}
                                                            <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                                                📏 Size: {item.size || 'M'}
                                                            </span>
                                                            <span>
                                                                Qty: <strong>{item.quantity}</strong> × ₹{Number(item.price).toLocaleString('en-IN')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                    <div style={{ fontWeight: '800', color: '#059669', fontSize: '16px' }}>
                                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </div>
                                                    {(item.product_id || item.id) && (
                                                        <Link
                                                            to={`/products/${item.product_id || item.id}`}
                                                            style={{
                                                                fontSize: '12px',
                                                                fontWeight: '800',
                                                                color: '#b45309',
                                                                background: '#fef3c7',
                                                                border: '1px solid #fde68a',
                                                                padding: '4px 10px',
                                                                borderRadius: '6px',
                                                                textDecoration: 'none',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                        >
                                                            ⭐ Write Review
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping & Payment Meta */}
                                    <div style={{
                                        background: '#f8fafc',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '13px',
                                        color: '#475569',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                        gap: '12px'
                                    }}>
                                        <div>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>📍 Delivery Address: </span>
                                            {order.address} {order.city ? `, ${order.city}` : ''} {order.state ? `, ${order.state}` : ''} {order.pincode ? `- ${order.pincode}` : ''}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>📞 Contact Phone: </span>
                                            {order.phone || order.customer_phone}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>💳 Payment Method: </span>
                                            {order.payment_method || 'UPI QR Payment'}
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: '700', color: '#0f172a' }}>🔒 Payment Status: </span>
                                            <span style={{ color: '#059669', fontWeight: '800' }}>✓ {order.payment_status || 'Paid'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Orders;
