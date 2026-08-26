import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';

function Checkout() {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const STORE_UPI_ID = 'bharathpandian450-1@okhdfcbank';
    const STORE_PAYEE_NAME = 'Kiskintha Mens Wear';

    const hasSavedAddress = user?.address && user.address.trim().length > 5;

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        utrRef: ''
    });
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [copiedUpi, setCopiedUpi] = useState(false);
    const [error, setError] = useState('');

    const totalAmount = getCartTotal();

    // Construct standard UPI Pay URL
    const upiPayUrl = `upi://pay?pa=${encodeURIComponent(STORE_UPI_ID)}&pn=${encodeURIComponent(STORE_PAYEE_NAME)}&am=${totalAmount}&cu=INR`;
    // High resolution dynamic QR code API
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayUrl)}`;

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        if (orderPlaced) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
    }, [orderPlaced]);

    // Redirect if not logged in
    if (!user) {
        navigate('/login');
        return null;
    }

    // Redirect if cart is empty
    if (cart.length === 0 && !orderPlaced) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCopyUpi = () => {
        navigator.clipboard.writeText(STORE_UPI_ID);
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.address || form.address.trim().length < 5) {
            setError('Please enter a complete delivery address (street name, city, pincode).');
            return;
        }

        if (!form.phone) {
            setError('Please enter a contact phone number.');
            return;
        }

        setLoading(true);
        try {
            // Auto update profile address if missing or changed
            if (updateProfile && (!user?.address || user.address !== form.address)) {
                await updateProfile({ name: form.name || user?.name, phone: form.phone, address: form.address });
            }

            const orderData = {
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                })),
                address: form.address,
                phone: form.phone,
                payment_method: 'UPI QR Payment',
                upi_id: STORE_UPI_ID,
                utr_ref: form.utrRef || 'UPI Direct Payment'
            };

            const res = await API.post('/orders', orderData);
            setOrderId(res.data.orderId);
            setOrderPlaced(true);
            clearCart();
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success screen
    if (orderPlaced) {
        return (
            <div className="checkout-page" style={{ padding: '40px 16px' }}>
                <div className="container">
                    <div className="order-success" style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', textAlign: 'center', maxWidth: '640px', margin: '20px auto', borderTop: '5px solid #d4af37' }}>
                        <div className="emoji" style={{ fontSize: '48px', marginBottom: '12px' }}>📱</div>
                        <h2 style={{ color: '#0f172a', margin: '0 0 10px' }}>UPI Payment Submitted — Pending Approval</h2>
                        
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '16px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>
                            Order #{orderId} submitted! Amount: <span style={{ color: '#b45309', fontSize: '16px' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                            <div style={{ fontSize: '13px', marginTop: '6px', fontWeight: '500', color: '#78350f' }}>
                                Status: ⏳ Pending Store Owner Approval
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px', textAlign: 'left' }}>
                            <h4 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '15px' }}>💳 Payment Verification Details:</h4>
                            <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.8' }}>
                                <div><strong>Store Payee:</strong> Kiskintha Mens Wear</div>
                                <div><strong>Store UPI ID:</strong> <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#0f172a', fontWeight: '700' }}>{STORE_UPI_ID}</code></div>
                                <div><strong>Total Amount:</strong> ₹{totalAmount.toLocaleString('en-IN')}</div>
                                {form.utrRef && <div><strong>UTR / Ref No:</strong> {form.utrRef}</div>}
                                <div><strong>Delivery Address:</strong> {form.address}</div>
                            </div>
                        </div>

                        <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                            Your order has been placed successfully! Estimated delivery is <strong>🚚 5 to 7 Working Days</strong> across Tamil Nadu & India.
                        </p>

                        <Link to="/" className="btn btn-primary" style={{ padding: '14px 28px', fontWeight: '700', borderRadius: '10px' }}>
                            Continue Shopping →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page" style={{ padding: '40px 16px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>🛍️ Checkout & UPI QR Payment</h1>

                {!hasSavedAddress && (
                    <div className="alert" style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '28px' }}>📍</span>
                            <div>
                                <h3 style={{ margin: 0, color: '#92400e', fontSize: '16px' }}>Enter Delivery Address Below</h3>
                                <p style={{ margin: '4px 0 0', color: '#b45309', fontSize: '13px' }}>
                                    Enter your delivery address in the form below. It will automatically be saved to your profile upon placing your order!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {hasSavedAddress && (
                    <div className="alert" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>✓ Saved Delivery Address Loaded:</strong>
                            <div style={{ fontSize: '13px', marginTop: '2px' }}>{user.address}</div>
                        </div>
                        <Link to="/settings" style={{ color: '#15803d', fontWeight: '600', textDecoration: 'underline', fontSize: '13px' }}>
                            Edit Address
                        </Link>
                    </div>
                )}

                <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px' }}>
                    <form className="checkout-form" onSubmit={handleSubmit} style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>📍 Delivery Details</h3>

                        {error && <div className="alert alert-error" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="Enter contact phone number"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label style={{ fontWeight: '600', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Delivery Address *</label>
                            <textarea
                                name="address"
                                className="form-control"
                                placeholder="Enter complete door no, street name, city, landmark, pincode..."
                                value={form.address}
                                onChange={handleChange}
                                required
                                rows="3"
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            ></textarea>
                        </div>

                        {/* DEFAULT & MANDATORY UPI QR PAYMENT CARD */}
                        <h3 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>📱 Default Payment Method</span>
                            <span style={{ fontSize: '12px', background: '#d4af37', color: '#000', padding: '3px 10px', borderRadius: '20px', fontWeight: '800' }}>🔒 DEFAULT UPI</span>
                        </h3>

                        <div className="upi-payment-card" style={{ background: '#fafaf9', border: '2px solid #d4af37', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px', boxShadow: '0 4px 16px rgba(212,175,55,0.15)' }}>
                            <div style={{ display: 'inline-block', background: '#ffffff', padding: '12px', borderRadius: '14px', border: '1px solid #e7e5e4', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                                <img
                                    src={qrCodeImageUrl}
                                    alt="Kiskintha Mens Wear UPI QR Code"
                                    style={{ width: '220px', height: '220px', display: 'block', borderRadius: '8px' }}
                                />
                            </div>

                            <div style={{ marginTop: '16px' }}>
                                <div style={{ fontSize: '14px', color: '#78716c', fontWeight: '600' }}>Scan & Pay Total Amount</div>
                                <div style={{ fontSize: '26px', fontWeight: '900', color: '#0f172a', margin: '4px 0 12px' }}>
                                    ₹{totalAmount.toLocaleString('en-IN')}
                                </div>
                            </div>

                            {/* UPI ID COPY BOX */}
                            <div style={{ background: '#ffffff', border: '1px dashed #d4af37', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', color: '#78716c', textTransform: 'uppercase', fontWeight: '700' }}>Store UPI ID:</div>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{STORE_UPI_ID}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyUpi}
                                    style={{ background: copiedUpi ? '#059669' : '#0f172a', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                    {copiedUpi ? '✓ Copied!' : '📋 Copy UPI'}
                                </button>
                            </div>

                            {/* MOBILE DIRECT PAY BUTTON */}
                            <a
                                href={upiPayUrl}
                                style={{ display: 'block', width: '100%', background: '#0f172a', color: '#d4af37', padding: '12px', borderRadius: '10px', fontWeight: '800', fontSize: '14px', textDecoration: 'none', marginBottom: '14px' }}
                            >
                                ⚡ Pay via GPay / PhonePe / Paytm App
                            </a>

                            <div style={{ fontSize: '12px', color: '#57534e', lineHeight: '1.5' }}>
                                📷 Open <strong>Google Pay, PhonePe, Paytm or BHIM</strong> on your mobile, scan the QR code above, and pay <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>.
                            </div>

                            {/* UTR REFERENCE INPUT */}
                            <div style={{ marginTop: '16px', textAlign: 'left', background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e7e5e4' }}>
                                <label style={{ fontSize: '12px', fontWeight: '700', color: '#44403c', display: 'block', marginBottom: '4px' }}>
                                    Optional: UPI Transaction UTR / Ref No.
                                </label>
                                <input
                                    type="text"
                                    name="utrRef"
                                    className="form-control"
                                    placeholder="e.g. 421098453210 (12-digit UTR)"
                                    value={form.utrRef}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '17px',
                                fontWeight: '800',
                                background: '#0f172a',
                                color: '#d4af37',
                                border: '2px solid #d4af37',
                                borderRadius: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            {loading ? 'Submitting Order...' : `Complete Order — ₹${totalAmount.toLocaleString('en-IN')}`}
                        </button>
                    </form>

                    {/* CART SUMMARY */}
                    <div className="cart-summary" style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
                        <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>Order Summary</h3>
                        {cart.map((item, index) => (
                            <div key={index} className="cart-summary-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#334155' }}>
                                <span>{item.name} × {item.quantity} ({item.size})</span>
                                <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <div className="cart-summary-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #f1f5f9', fontSize: '13px' }}>
                            <span>Delivery Fee</span>
                            <span style={{ color: '#059669', fontWeight: '700' }}>FREE</span>
                        </div>
                        <div className="cart-summary-row total" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '2px solid #e2e8f0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                            <span>Total Payable</span>
                            <span style={{ color: '#b45309' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
