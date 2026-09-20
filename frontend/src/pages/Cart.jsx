import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && (user.role === 'owner' || user.role === 'admin')) {
            navigate('/owner');
        }
    }, [user, navigate]);

    const handleCheckout = () => {
        if (!user) {
            alert('Please login to proceed to checkout.');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="cart-empty">
                        <div className="emoji">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping →</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart ({getCartCount()} items)</h1>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <CartItem
                                key={`${item.id}-${item.size}-${index}`}
                                item={item}
                                onRemove={removeFromCart}
                                onUpdateQuantity={updateQuantity}
                            />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="cart-summary-row">
                            <span>Items ({getCartCount()})</span>
                            <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                        </div>
                        <div className="cart-summary-row">
                            <span>Delivery</span>
                            <span style={{ color: '#059669' }}>FREE</span>
                        </div>
                        <div className="cart-summary-row total">
                            <span>Total</span>
                            <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                        </div>
                        <button className="btn btn-primary btn-block" onClick={handleCheckout}>
                            Proceed to Checkout →
                        </button>
                        <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '12px', fontSize: '14px', color: '#1a56db' }}>
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
