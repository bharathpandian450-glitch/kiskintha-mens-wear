import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

const pagePantsTitles = {
    1: '👖 Page 1: Slim Fit Denim Jeans Collection',
    2: '👖 Page 2: Executive Chino Pants Collection',
    3: '👖 Page 3: Formal Trouser Slacks Collection',
    4: '👖 Page 4: Utility 6-Pocket Cargo Pants Collection',
    5: '👖 Page 5: Stretch Casual Cotton Pants Collection',
    6: '👖 Page 6: Straight Fit Heavyweight Jeans Collection',
    7: '👖 Page 7: Relaxed Fit Linen-Cotton Slacks Collection',
    8: '👖 Page 8: Tapered Ankle Fit Pants Collection',
    9: '👖 Page 9: Vintage Washed Denim Pants Collection'
};

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';

    // Filter and Sort states
    const [search, setSearch] = useState(searchQuery);
    const [selectedSize, setSelectedSize] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [sleeveType, setSleeveType] = useState('All');
    const [pantType, setPantType] = useState('All');
    const [sortBy, setSortBy] = useState('featured');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        setSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (activeCategory) params.category = activeCategory;
                if (searchQuery) params.search = searchQuery;
                const response = await API.get('/products', { params });
                const data = response.data;
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data && Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [activeCategory, searchQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = {};
        if (activeCategory) params.category = activeCategory;
        if (search.trim()) params.search = search.trim();
        setSearchParams(params);
        setCurrentPage(1);
    };

    // Filter products dynamically (Size, Rate, Full Hand vs Off Hand, Pant Type)
    const filteredProducts = useMemo(() => {
        let list = [...products];

        // 1. Size filter
        if (selectedSize !== 'All') {
            list = list.filter(p => p.size && p.size.split(',').map(s => s.trim()).includes(selectedSize));
        }

        // 2. Rate / Price filter
        if (priceRange === 'under500') {
            list = list.filter(p => Number(p.price) <= 500);
        } else if (priceRange === '500-999') {
            list = list.filter(p => Number(p.price) >= 500 && Number(p.price) <= 999);
        } else if (priceRange === '1000-1499') {
            list = list.filter(p => Number(p.price) >= 1000 && Number(p.price) <= 1499);
        } else if (priceRange === 'above1500') {
            list = list.filter(p => Number(p.price) >= 1500);
        }

        // 3. Sleeve Type filter (Full Hand vs Off Hand / Half Hand)
        if (sleeveType === 'full') {
            list = list.filter(p => {
                const text = (p.name + ' ' + (p.description || '') + ' ' + (p.subcategory || '')).toLowerCase();
                return text.includes('full') || text.includes('long') || text.includes('full sleeve') || text.includes('full hand');
            });
        } else if (sleeveType === 'half') {
            list = list.filter(p => {
                const text = (p.name + ' ' + (p.description || '') + ' ' + (p.subcategory || '')).toLowerCase();
                return text.includes('half') || text.includes('short') || text.includes('off hand') || text.includes('polo') || !text.includes('full');
            });
        }

        // 4. Pant Type filter (Cotton, Linen, Lycra, Jeans, Chino, Cargo)
        if (pantType !== 'All') {
            list = list.filter(p => {
                const text = (p.name + ' ' + (p.description || '') + ' ' + (p.subcategory || '')).toLowerCase();
                if (pantType === 'jeans') return text.includes('jeans') || text.includes('denim');
                if (pantType === 'cotton') return text.includes('cotton') || text.includes('stretch casual');
                if (pantType === 'linen') return text.includes('linen') || text.includes('relaxed fit');
                if (pantType === 'lycra') return text.includes('lycra') || text.includes('stretch') || text.includes('ankle fit');
                if (pantType === 'chino') return text.includes('chino') || text.includes('formal') || text.includes('trouser') || text.includes('slacks');
                if (pantType === 'cargo') return text.includes('cargo') || text.includes('6-pocket') || text.includes('utility');
                return true;
            });
        }

        // 5. Sorting
        if (sortBy === 'price-low') {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'newest') {
            list.sort((a, b) => Number(b.id) - Number(a.id));
        }

        return list;
    }, [products, selectedSize, priceRange, sleeveType, pantType, sortBy]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSize, priceRange, sleeveType, pantType, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const getCategoryBadgeName = () => {
        if (activeCategory === '2') return '👔 Shirts Collection';
        if (activeCategory === '1') return '👕 T-Shirts Collection';
        if (activeCategory === '3') {
            return pagePantsTitles[currentPage] || '👖 Pants Collection';
        }
        return '🛍️ All Products Catalog';
    };

    return (
        <div className="products-page" style={{ padding: '32px 16px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
                
                {/* Catalog Header */}
                <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {searchQuery ? `Search Results: "${searchQuery}"` : getCategoryBadgeName()}
                            <span style={{ fontSize: '13px', background: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '20px', fontWeight: '700' }}>
                                {filteredProducts.length} Items Total
                            </span>
                        </h1>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                            Kiskintha Mens Wear — Distinct Style Showcase Per Page
                        </p>
                    </div>


                </div>

                {/* Page Type Distinction Banner for Pants */}
                {activeCategory === '3' && (
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: '#ffffff',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                    }}>
                        <div>
                            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', fontWeight: '700' }}>
                                CURRENT PAGE STYLE SHOWCASE
                            </span>
                            <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '800', color: '#fef08a' }}>
                                {pagePantsTitles[currentPage] || '👖 Pants Collection'}
                            </h3>
                        </div>
                        <span style={{ background: '#2563eb', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}

                {/* High-Visibility Filter & Sort Toolbar */}
                <div className="filter-bar" style={{
                    background: '#ffffff',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '2px solid #cbd5e1',
                    marginBottom: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🎛️</span> FILTER & SORT PRODUCTS ({filteredProducts.length} Items Available)
                        </h3>
                        <button
                            onClick={() => { setSelectedSize('All'); setPriceRange('All'); setSleeveType('All'); setSortBy('featured'); }}
                            style={{
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                padding: '5px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#475569',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Reset Filters
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between'
                    }}>
                        {/* 1. Size Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>📏 Size:</span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {['All', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                                    <button
                                        key={sz}
                                        onClick={() => setSelectedSize(sz)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            border: selectedSize === sz ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                            background: selectedSize === sz ? '#2563eb' : '#ffffff',
                                            color: selectedSize === sz ? '#ffffff' : '#334155',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Rate / Price Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>💵 Rate / Price:</span>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    border: '2px solid #cbd5e1',
                                    fontSize: '13px',
                                    color: '#0f172a',
                                    fontWeight: '800',
                                    background: '#ffffff',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="All">All Rates</option>
                                <option value="under500">Under ₹500</option>
                                <option value="500-999">₹500 - ₹999</option>
                                <option value="1000-1499">₹1000 - ₹1499</option>
                                <option value="above1500">Above ₹1500</option>
                            </select>
                        </div>

                        {/* 3. Sleeve Type Filter (Full Hand vs Off / Half Hand) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>👔 Sleeve Type:</span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[
                                    { label: 'All', value: 'All' },
                                    { label: 'Full Hand', value: 'full' },
                                    { label: 'Off / Half Hand', value: 'half' }
                                ].map(sl => (
                                    <button
                                        key={sl.value}
                                        onClick={() => setSleeveType(sl.value)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: '800',
                                            border: sleeveType === sl.value ? '2px solid #0f172a' : '1px solid #cbd5e1',
                                            background: sleeveType === sl.value ? '#0f172a' : '#ffffff',
                                            color: sleeveType === sl.value ? '#ffffff' : '#475569',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {sl.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Sort By Rate */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>⚡ Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '8px',
                                    border: '2px solid #cbd5e1',
                                    fontSize: '13px',
                                    color: '#0f172a',
                                    fontWeight: '800',
                                    background: '#ffffff',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="featured">Featured Catalog</option>
                                <option value="price-low">Rate: Low to High</option>
                                <option value="price-high">Rate: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                            </select>
                        </div>
                    </div>

                    {/* 5. Pant Fabric & Style Type Filter (Specific for Pants Collection) */}
                    {(activeCategory === '3' || activeCategory === '') && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pt: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                👖 Pant Type:
                            </span>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {[
                                    { label: 'All Pant Types', value: 'All' },
                                    { label: '👖 Jeans (Denim)', value: 'jeans' },
                                    { label: '🧵 Cotton Pants', value: 'cotton' },
                                    { label: '🌿 Linen Slacks', value: 'linen' },
                                    { label: '⚡ Lycra Stretch', value: 'lycra' },
                                    { label: '💼 Chino & Formal', value: 'chino' },
                                    { label: '📦 6-Pocket Cargo', value: 'cargo' }
                                ].map(pt => (
                                    <button
                                        key={pt.value}
                                        onClick={() => setPantType(pt.value)}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: '800',
                                            border: pantType === pt.value ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                            background: pantType === pt.value ? '#eff6ff' : '#ffffff',
                                            color: pantType === pt.value ? '#1e40af' : '#475569',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {pt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading" style={{ textAlign: 'center', padding: '60px' }}>
                        <div className="spinner"></div>
                        <p>Loading catalog...</p>
                    </div>
                ) : paginatedProducts.length > 0 ? (
                    <>
                        <div className="products-grid">
                            {paginatedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.max(1, p - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === 1}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                                        color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                                        fontWeight: '700',
                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    « Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => {
                                            setCurrentPage(page);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            border: currentPage === page ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                            background: currentPage === page ? '#2563eb' : '#ffffff',
                                            color: currentPage === page ? '#ffffff' : '#0f172a',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => {
                                        setCurrentPage(p => Math.min(totalPages, p + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={currentPage === totalPages}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
                                        color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
                                        fontWeight: '700',
                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Next »
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-products" style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>👖</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>No Matching Pants Found</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            Try adjusting your search keywords, size, or price filter.
                        </p>
                        <button
                            onClick={() => { setSelectedSize('All'); setSelectedColor('All'); setMaxPrice(3000); setSearch(''); setSearchParams({}); }}
                            className="btn btn-primary"
                            style={{ marginTop: '16px' }}
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
