import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api';

const getImageSrc = (img) => getImageUrl(img);

function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const sizes = product.size ? product.size.split(',').map(s => s.trim()) : ['M'];
        const selectedSize = sizes[0] || 'M';
        addToCart(product, selectedSize, 1, product.color || '');
        alert(`Added ${product.name} (Size: ${selectedSize}) to cart!`);
    };

    const availableSizes = product.size ? product.size.split(',').slice(0, 5).join(', ') : 'S, M, L, XL, XXL';

    const isOutOfStock = !product.stock || Number(product.stock) <= 0;

    return (
        <div className="product-card" style={{ position: 'relative', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', opacity: isOutOfStock ? 0.85 : 1 }}>
            <Link to={`/products/${product.id}`}>
                <div className="product-card-image" style={{ position: 'relative', overflow: 'hidden', height: '260px', background: '#f8fafc' }}>
                    {product.image ? (
                        <img
                            src={getImageSrc(product.image)}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.onerror = null;
                                const filename = (product.image || '').split('/').pop();
                                e.target.src = getImageUrl(filename);
                            }}
                        />

                    ) : (
                        <span className="placeholder">👕</span>
                    )}

                    {isOutOfStock && (
                        <span style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#dc2626',
                            color: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '800',
                            letterSpacing: '0.5px'
                        }}>
                            OUT OF STOCK
                        </span>
                    )}
                </div>
            </Link>
            
            <div className="product-card-info" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-primary category" style={{ background: '#eff6ff', color: '#1e40af', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                        {product.subcategory || product.category_name || 'Men Wear'}
                    </span>
                    {!isOutOfStock ? (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                            ✓ In Stock ({product.stock})
                        </span>
                    ) : (
                        <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '800' }}>
                            ⚠️ Out of Stock
                        </span>
                    )}
                </div>

                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                    <div className="name" style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '700', color: '#0f172a', fontSize: '14px', lineHeight: '1.3' }}>
                        {product.name}
                    </div>
                </Link>
                
                {/* Size & Delivery Info */}
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#64748b', margin: '6px 0 8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span>📏 {availableSizes}</span>
                    {!isOutOfStock && <span style={{ color: '#059669', fontWeight: '700' }}>• 🚚 5-7 Days Delivery</span>}
                </div>

                {/* Price Display */}
                <div className="price" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: isOutOfStock ? '#64748b' : '#059669' }}>
                        ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    style={{
                        width: '100%',
                        fontWeight: '700',
                        borderRadius: '8px',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '6px',
                        background: isOutOfStock ? '#94a3b8' : '#2563eb',
                        borderColor: isOutOfStock ? '#94a3b8' : '#2563eb',
                        cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isOutOfStock ? '🚫 Out of Stock' : '🛒 Add to Cart'}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
