import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { getImageUrl } from '../api';
import { useCart } from '../context/CartContext';

const getImageSrc = (img) => getImageUrl(img);


function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                const data = res.data;
                setProduct(data);
                setActiveImage(data.image);

                // Set default size and color
                const sizes = data.size ? data.size.split(',').map(s => s.trim()) : ['32'];
                if (sizes.length > 0) setSelectedSize(sizes[0]);
                setSelectedColor(data.color || 'Dark Indigo');
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a waist size');
            return;
        }
        addToCart(product, selectedSize, quantity, selectedColor, activeImage);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert('Please select a waist size');
            return;
        }
        addToCart(product, selectedSize, quantity, selectedColor, activeImage);
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="loading" style={{ textAlign: 'center', padding: '80px' }}>
                <div className="spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="loading" style={{ textAlign: 'center', padding: '80px' }}>
                <p>Product not found.</p>
            </div>
        );
    }

    const sizes = product.size ? product.size.split(',').map(s => s.trim()) : ['28', '30', '32', '34', '36', '38', '40'];
    return (
        <div className="product-detail" style={{ padding: '30px 12px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className="container product-detail-card" style={{ maxWidth: '1100px', margin: '0 auto', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <div className="product-detail-grid">
                    
                    {/* Left: Product Image */}
                    <div className="product-detail-image" style={{ textAlign: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '420px', overflow: 'hidden' }}>
                        {activeImage || product.image ? (
                            <img
                                src={getImageSrc(activeImage || product.image)}
                                alt={product.name}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '440px',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    const filename = (product?.image || '').split('/').pop();
                                    e.target.src = getImageUrl(filename);
                                }}
                            />
                        ) : (
                            <span className="placeholder" style={{ fontSize: '80px' }}>👕</span>
                        )}
                    </div>

                    {/* Right: Product Info & Actions */}
                    <div className="product-detail-info">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span className="badge badge-primary">{product.category_name || 'Men Wear'}</span>
                        </div>

                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 12px', lineHeight: '1.3' }}>
                            {product.name}
                        </h1>

                        {/* Price Block */}
                        <div className="price-block" style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '30px', fontWeight: '800', color: '#059669' }}>
                                ₹{Number(product.price).toLocaleString('en-IN')}
                            </span>
                        </div>

                        <p className="description" style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="stock" style={{ marginBottom: '20px' }}>
                            {product.stock > 0 ? (
                                <span className="badge badge-success" style={{ background: '#dcfce7', color: '#15803d', fontWeight: '700', padding: '6px 12px', borderRadius: '20px' }}>
                                    ✓ In Stock ({product.stock} units available)
                                </span>
                            ) : (
                                <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#b91c1c', fontWeight: '700', padding: '6px 12px', borderRadius: '20px' }}>
                                    ✗ Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Size Selection */}
                        <div className="size-selector" style={{ marginBottom: '20px' }}>
                            <label style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                Select Size:
                            </label>
                            <div className="sizes" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {sizes.map((s, index) => (
                                    <button
                                        key={index}
                                        className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            border: selectedSize === s ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                            background: selectedSize === s ? '#2563eb' : '#ffffff',
                                            color: selectedSize === s ? '#ffffff' : '#334155',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="quantity-selector" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <label style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>Quantity:</label>
                            <div className="qty-controls" style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                                >
                                    -
                                </button>
                                <span style={{ padding: '8px 16px', fontWeight: '800', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons: Add to Cart & Buy Now */}
                        <div className="product-detail-actions">
                            <button
                                className={`btn btn-primary ${added ? 'btn-success' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                style={{ padding: '14px', fontSize: '15px', fontWeight: '700', borderRadius: '10px' }}
                            >
                                {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                            </button>

                            <button
                                className="btn"
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                style={{ padding: '14px', fontSize: '15px', fontWeight: '800', borderRadius: '10px', background: '#059669', color: '#ffffff', border: 'none', cursor: 'pointer' }}
                            >
                                ⚡ Buy Now (COD / UPI)
                            </button>
                        </div>

                        {/* Delivery Timeline & Guarantee Info Box */}
                        <div style={{
                            marginTop: '24px',
                            padding: '16px 20px',
                            borderRadius: '12px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '24px' }}>🚚</span>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                                        Estimated Delivery: <span style={{ color: '#059669' }}>5 to 7 Working Days</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                        Fast Express Dispatch across Tamil Nadu & India (Dispatched within 24 Hours)
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '12px', color: '#475569', fontWeight: '700', flexWrap: 'wrap' }}>
                                <span>📍 Free Shipping</span>
                                <span>💵 Cash on Delivery</span>
                                <span>🔄 7-Day Easy Exchange</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
