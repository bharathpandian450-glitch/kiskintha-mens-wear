import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { initialCategories, initialProducts } from '../data/initialProducts';

const categoryEmojis = {
    'T-Shirts': '👕',
    'Shirts': '👔',
    'Pants': '👖',
    'Trousers': '👖',
    'Hoodies': '🧥',
    'Hoodie': '🧥',
    'Group Shirts': '👔'
};

// Custom visual icons for categories
const categoryCustomIcons = {
    'Pants': (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', border: '2px solid #3b82f6', fontSize: '28px' }}>
            👖
        </span>
    ),
    'Hoodies': (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', border: '2px solid #ef4444', fontSize: '28px', position: 'relative' }}>
            🧥<span style={{ position: 'absolute', bottom: '2px', right: '2px', fontSize: '12px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>H</span>
        </span>
    )
};

function Home() {
    const [categories, setCategories] = useState(initialCategories);
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    API.get('/categories').catch(() => ({ data: initialCategories })),
                    API.get('/products').catch(() => ({ data: initialProducts }))
                ]);
                const cats = Array.isArray(catRes.data) && catRes.data.length > 0 ? catRes.data : initialCategories;
                setCategories(cats);
                const pData = prodRes.data;
                const fetchedProds = Array.isArray(pData) && pData.length > 0 ? pData : (pData?.products && pData.products.length > 0 ? pData.products : initialProducts);
                setProducts(fetchedProds);
            } catch (error) {
                console.error('Error fetching data:', error);
                setCategories(initialCategories);
                setProducts(initialProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1>Kiskintha Mens Wear</h1>
                    <p>Premium Men's Clothing Store — Shop the latest collection of T-Shirts, Shirts, Group Shirts, Pants, and Hoodies at the best prices.</p>
                    <Link to="/products" className="btn">Shop Now →</Link>
                </div>
            </section>

            {/* Categories Section */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <Link to={`/products?category=${cat.id}`} key={cat.id}>
                                <div className="category-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                                    <div className="emoji" style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                                        {categoryCustomIcons[cat.name] || (
                                            <span style={{ fontSize: '36px' }}>{categoryEmojis[cat.name] || '🏷️'}</span>
                                        )}
                                    </div>
                                    <div className="name" style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>{cat.name}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section" style={{ paddingTop: 0 }}>
                <div className="container">
                    <h2 className="section-title">Featured Products</h2>
                    {products.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {products.slice(0, 8).map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                <Link to="/products" className="btn btn-primary">View All Products →</Link>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛍️</div>
                            <h3>No Clothes Uploaded Yet</h3>
                            <p style={{ color: '#6b7280', marginBottom: '16px' }}>Store Owner or Admin can log in to upload product details, pricing, and stock.</p>
                            <Link to="/login" className="btn btn-primary">Login to Upload Products →</Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Home;
