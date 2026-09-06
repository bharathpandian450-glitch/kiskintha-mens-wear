import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API, { getImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const getImageSrc = (img) => getImageUrl(img);

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const isOwnerOrAdmin = user && (user.role === 'owner' || user.role === 'admin');

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    // Reviews State
    const [reviewsData, setReviewsData] = useState({ total_reviews: 0, average_rating: 4.5, reviews: [] });
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
    const [reviewErrorMsg, setReviewErrorMsg] = useState('');

    const fetchProductAndReviews = async () => {
        try {
            const [pRes, rRes] = await Promise.all([
                API.get(`/products/${id}`),
                API.get(`/reviews/product/${id}`).catch(() => ({ data: { total_reviews: 0, average_rating: 4.5, reviews: [] } }))
            ]);

            const data = pRes.data;
            setProduct(data);
            setActiveImage(data.image);

            const sizes = data.size ? data.size.split(',').map(s => s.trim()) : ['32'];
            if (sizes.length > 0) setSelectedSize(sizes[0]);
            setSelectedColor(data.color || 'Assorted');

            if (rRes.data) {
                setReviewsData(rRes.data);
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProductAndReviews();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, selectedSize, quantity, selectedColor, activeImage);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, selectedSize, quantity, selectedColor, activeImage);
        navigate('/checkout');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please sign in to your customer account to post a review.');
            navigate('/login');
            return;
        }
        if (!reviewComment.trim()) {
            setReviewErrorMsg('Please enter your review comment.');
            return;
        }

        try {
            setSubmittingReview(true);
            setReviewErrorMsg('');
            setReviewSuccessMsg('');

            const res = await API.post('/reviews', {
                product_id: product.id,
                rating: reviewRating,
                comment: reviewComment.trim()
            });

            setReviewSuccessMsg(res.data?.message || 'Thank you! Your customer review has been published.');
            setReviewComment('');
            setReviewRating(5);

            // Refresh product and reviews list
            const rRes = await API.get(`/reviews/product/${id}`);
            if (rRes.data) setReviewsData(rRes.data);
        } catch (err) {
            setReviewErrorMsg(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
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

    const sizes = product.size ? product.size.split(',').map(s => s.trim()) : ['S', 'M', 'L', 'XL', 'XXL'];
    const avgRating = reviewsData.average_rating || product.rating || 4.5;
    const totalReviews = reviewsData.total_reviews || (reviewsData.reviews ? reviewsData.reviews.length : 0);

    return (
        <div className="product-detail" style={{ padding: '30px 12px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Main Product Card */}
                <div className="product-detail-card" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', padding: '24px' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span className="badge badge-primary">{product.category_name || 'Men Wear'}</span>
                                {product.sleeve_type && (
                                    <span style={{
                                        background: product.sleeve_type === 'Half Hand' ? '#fef3c7' : '#f0fdf4',
                                        color: product.sleeve_type === 'Half Hand' ? '#b45309' : '#166534',
                                        border: product.sleeve_type === 'Half Hand' ? '1px solid #fde68a' : '1px solid #bbf7d0',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '800'
                                    }}>
                                        {product.sleeve_type === 'Half Hand' ? '👕 Half Hand' : '👔 Full Hand'}
                                    </span>
                                )}
                                <span style={{ fontSize: '13px', color: '#eab308', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    ⭐ {avgRating} ({totalReviews} customer reviews)
                                </span>
                            </div>

                            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '8px 0 12px', lineHeight: '1.3' }}>
                                {product.name}
                            </h1>

                            {/* Price Block */}
                            <div className="price-block" style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '30px', fontWeight: '800', color: '#059669' }}>
                                    ₹{Number(product.price).toLocaleString('en-IN')}
                                </span>
                                {product.original_price && (
                                    <span style={{ fontSize: '16px', color: '#94a3b8', textDecoration: 'line-through' }}>
                                        ₹{Number(product.original_price).toLocaleString('en-IN')}
                                    </span>
                                )}
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

                            {/* Quantity Selector (Only for Customers) */}
                            {!isOwnerOrAdmin && (
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
                            )}

                            {/* Action Buttons: Add to Cart & Buy Now (Only for Customers) */}
                            {!isOwnerOrAdmin && (
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
                            )}

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

                {/* 🌟 CUSTOMER REVIEWS & RATINGS SECTION 🌟 */}
                <div id="reviews-section" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>💬</span> Customer Ratings & Reviews
                            </h2>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                                Real feedback from verified Kiskintha Mens Wear customers
                            </p>
                        </div>

                        {/* Overall Rating Box */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{avgRating}</div>
                            <div>
                                <div style={{ color: '#eab308', fontSize: '16px', letterSpacing: '2px' }}>
                                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', marginTop: '2px' }}>
                                    Based on {totalReviews} reviews
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Write a Review Form */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✍️</span> Write a Customer Review
                        </h3>

                        {reviewSuccessMsg && (
                            <div style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '700' }}>
                                {reviewSuccessMsg}
                            </div>
                        )}
                        {reviewErrorMsg && (
                            <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '700' }}>
                                {reviewErrorMsg}
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Star Rating Interactive Selector */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    Your Rating:
                                </label>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                fontSize: '28px',
                                                cursor: 'pointer',
                                                color: (hoverRating || reviewRating) >= star ? '#eab308' : '#cbd5e1',
                                                padding: '0 2px',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            title={`${star} Star${star > 1 ? 's' : ''}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginLeft: '8px' }}>
                                        {hoverRating || reviewRating} / 5 Stars
                                    </span>
                                </div>
                            </div>

                            {/* Comment Textarea */}
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    Your Review Feedback:
                                </label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share your experience about cloth fitting, quality, material, color, stitching..."
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '14px',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Submit Button */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {user ? (
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="btn btn-primary"
                                        style={{ padding: '10px 24px', fontWeight: '800', borderRadius: '8px', fontSize: '14px' }}
                                    >
                                        {submittingReview ? 'Submitting Review...' : '⭐ Submit Review'}
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="btn btn-primary"
                                        style={{ padding: '10px 24px', fontWeight: '800', borderRadius: '8px', fontSize: '14px', textDecoration: 'none' }}
                                    >
                                        🔐 Sign In to Write a Review
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Reviews List */}
                    {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {reviewsData.reviews.map((rev) => {
                                const revDate = rev.created_at
                                    ? new Date(rev.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                                    : 'Recently';

                                return (
                                    <div
                                        key={rev.id}
                                        style={{
                                            padding: '16px 20px',
                                            borderRadius: '12px',
                                            border: '1px solid #f1f5f9',
                                            background: '#ffffff',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>
                                                    {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : 'C'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '14px' }}>
                                                        {rev.customer_name || 'Verified Customer'}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#166534', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        ✓ Verified Buyer
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: '#eab308', fontSize: '14px' }}>
                                                    {'★'.repeat(Number(rev.rating || 5))}{'☆'.repeat(5 - Number(rev.rating || 5))}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{revDate}</div>
                                            </div>
                                        </div>

                                        <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                                            "{rev.comment}"
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                            <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>No customer reviews yet. Be the first customer to leave a review!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ProductDetail;
