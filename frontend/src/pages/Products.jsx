import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import { initialProducts } from '../data/initialProducts';

const categoriesList = [
    { id: '', name: 'All Products', icon: '🛍️' },
    { id: '2', name: 'Shirts', icon: '👔', catId: '2' },
    { id: 'shirts-full', name: 'Full Hand Shirts', icon: '👔', catId: '2', sleeve: 'Full Hand' },
    { id: 'shirts-half', name: 'Half Hand Shirts', icon: '👕', catId: '2', sleeve: 'Half Hand' },
    { id: '1', name: 'T-Shirts', icon: '👕', catId: '1' },
    { id: 'tshirts-full', name: 'Full Hand T-Shirts', icon: '👔', catId: '1', sleeve: 'Full Hand' },
    { id: 'tshirts-half', name: 'Half Hand T-Shirts', icon: '👕', catId: '1', sleeve: 'Half Hand' },
    { id: '3', name: 'Pants', icon: '👖', catId: '3' },
    { id: '4', name: 'Trousers', icon: '👖', catId: '4' },
    { id: '7', name: 'Hoodies', icon: '🧥', catId: '7' },
    { id: '8', name: 'Group Shirts', icon: '👔', catId: '8' }
];

const colorOptions = [
    { label: 'All Colors', value: 'All', colorCode: '#e2e8f0', textColor: '#0f172a' },
    { label: 'Black', value: 'Black', colorCode: '#09090b', textColor: '#ffffff' },
    { label: 'White', value: 'White', colorCode: '#ffffff', textColor: '#0f172a', border: '#cbd5e1' },
    { label: 'Blue', value: 'Blue', colorCode: '#2563eb', textColor: '#ffffff' },
    { label: 'Red', value: 'Red', colorCode: '#dc2626', textColor: '#ffffff' },
    { label: 'Green', value: 'Green', colorCode: '#16a34a', textColor: '#ffffff' },
    { label: 'Yellow', value: 'Yellow', colorCode: '#eab308', textColor: '#000000' },
    { label: 'Pink', value: 'Pink', colorCode: '#ec4899', textColor: '#ffffff' },
    { label: 'Brown', value: 'Brown', colorCode: '#78350f', textColor: '#ffffff' },
    { label: 'Grey', value: 'Grey', colorCode: '#64748b', textColor: '#ffffff' },
    { label: 'Other', value: 'Other', colorCode: '#a855f7', textColor: '#ffffff' }
];

function Products() {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';

    // Filter and Sort states
    const [search, setSearch] = useState(searchQuery);
    const [productType, setProductType] = useState('All'); // 'All', 'Full Hand', 'Half Hand'
    const [selectedColor, setSelectedColor] = useState('All'); // 'All', 'Black', 'White', 'Blue', 'Red', ...
    const [selectedSize, setSelectedSize] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [sortBy, setSortBy] = useState('featured');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        setSearch(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {};
                if (activeCategory) params.category = activeCategory;
                if (searchQuery) params.search = searchQuery;
                const response = await API.get('/products', { params });
                const data = response.data;
                let list = [];
                if (Array.isArray(data)) {
                    list = data;
                } else if (data && Array.isArray(data.products)) {
                    list = data.products;
                }
                if (list && list.length > 0) {
                    setProducts(list);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [activeCategory, searchQuery]);

    const handleCategoryClick = (catId) => {
        const newParams = {};
        if (catId) newParams.category = catId;
        if (searchQuery) newParams.search = searchQuery;
        setSearchParams(newParams);
        setCurrentPage(1);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const newParams = {};
        if (activeCategory) newParams.category = activeCategory;
        if (search.trim()) newParams.search = search.trim();
        setSearchParams(newParams);
        setCurrentPage(1);
    };

    const handleResetAllFilters = () => {
        setProductType('All');
        setSelectedColor('All');
        setSelectedSize('All');
        setPriceRange('All');
        setSortBy('featured');
        setSearch('');
        setSearchParams({});
        setCurrentPage(1);
    };

    // Filter products dynamically (Category, Product Type: Full Hand/Half Hand, Color, Size, Rate, Search, Sort)
    const filteredProducts = useMemo(() => {
        let list = [...products];

        // 1. Category Filter: Supports exact category + sleeve specifications (Full Hand Shirts vs Half Hand Shirts)
        if (activeCategory) {
            const activeCatObj = categoriesList.find(c => String(c.id).toLowerCase() === String(activeCategory).toLowerCase()) ||
                                 categoriesList.find(c => String(c.catId) === String(activeCategory) && !c.sleeve);
            if (activeCatObj) {
                if (activeCatObj.sleeve) {
                    list = list.filter(p => 
                        (String(p.category_id) === String(activeCatObj.catId) || (p.category_name && p.category_name.toLowerCase().includes(activeCatObj.catId === '2' ? 'shirt' : 't-shirt'))) && 
                        p.sleeve_type === activeCatObj.sleeve
                    );
                } else if (activeCatObj.catId) {
                    list = list.filter(p => {
                        const pCatId = String(p.category_id);
                        const targetCatId = String(activeCatObj.catId);
                        const pCatName = (p.category_name || '').toLowerCase();
                        const targetName = activeCatObj.name.toLowerCase();

                        if (targetCatId === '2') {
                            return (pCatId === '2' || (pCatName.includes('shirt') && !pCatName.includes('t-shirt') && !pCatName.includes('tshirt') && !pCatName.includes('group')));
                        } else if (targetCatId === '1') {
                            return (pCatId === '1' || pCatName.includes('t-shirt') || pCatName.includes('tshirt'));
                        } else if (targetCatId === '3') {
                            return (pCatId === '3' || pCatName.includes('pant'));
                        } else if (targetCatId === '4') {
                            return (pCatId === '4' || pCatName.includes('trouser'));
                        } else if (targetCatId === '7') {
                            return (pCatId === '7' || pCatName.includes('hoodie'));
                        } else if (targetCatId === '8') {
                            return (pCatId === '8' || pCatName.includes('group'));
                        }
                        return pCatId === targetCatId || pCatName.includes(targetName);
                    });
                }
            } else {
                list = list.filter(p => String(p.category_id) === String(activeCategory));
            }
        }

        // 2. Product Type / Sleeve Filter: STRICT Full Hand vs Half Hand
        if (productType === 'Full Hand') {
            list = list.filter(p => p.sleeve_type === 'Full Hand');
        } else if (productType === 'Half Hand') {
            list = list.filter(p => p.sleeve_type === 'Half Hand');
        }

        // 3. Color Filter: STRICT Exact Color Matching (Black, White, Blue, Red, Green, Yellow, Pink, Brown, Grey, Other)
        if (selectedColor && selectedColor !== 'All') {
            if (selectedColor === 'Other') {
                const standardColors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'pink', 'brown', 'grey', 'orange', 'sandal', 'multi'];
                list = list.filter(p => p.color && !standardColors.includes(p.color.trim().toLowerCase()));
            } else {
                const targetColor = selectedColor.trim().toLowerCase();
                list = list.filter(p => p.color && p.color.trim().toLowerCase() === targetColor);
            }
        }

        // 4. Size filter
        if (selectedSize !== 'All') {
            list = list.filter(p => p.size && p.size.split(',').map(s => s.trim()).includes(selectedSize));
        }

        // 5. Rate / Price filter
        if (priceRange === 'under500') {
            list = list.filter(p => Number(p.price) <= 500);
        } else if (priceRange === '500-999') {
            list = list.filter(p => Number(p.price) >= 500 && Number(p.price) <= 999);
        } else if (priceRange === '1000-1499') {
            list = list.filter(p => Number(p.price) >= 1000 && Number(p.price) <= 1499);
        } else if (priceRange === 'above1500') {
            list = list.filter(p => Number(p.price) >= 1500);
        }

        // 6. Search Query (supports both submitted search param and active search input)
        const q = (search || searchQuery || '').trim().toLowerCase();
        if (q) {
            list = list.filter(p =>
                (p.name && p.name.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q)) ||
                (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
                (p.category_name && p.category_name.toLowerCase().includes(q)) ||
                (p.color && p.color.toLowerCase().includes(q)) ||
                (p.sleeve_type && p.sleeve_type.toLowerCase().includes(q))
            );
        }

        // 7. Sorting
        if (sortBy === 'price-low') {
            list.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-high') {
            list.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'newest') {
            list.sort((a, b) => Number(b.id) - Number(a.id));
        }

        return list;
    }, [products, activeCategory, productType, selectedColor, selectedSize, priceRange, search, searchQuery, sortBy]);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, productType, selectedColor, selectedSize, priceRange, search, searchQuery, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const getActiveCategoryTitle = () => {
        if (!activeCategory) return '🛍️ All Products Catalog';
        const cat = categoriesList.find(c => String(c.id).toLowerCase() === String(activeCategory).toLowerCase()) ||
                    categoriesList.find(c => String(c.catId) === String(activeCategory) && !c.sleeve);
        return cat ? `${cat.icon} ${cat.name} Catalog` : '🛍️ Products Catalog';
    };

    const hasActiveFilters = productType !== 'All' || selectedColor !== 'All' || selectedSize !== 'All' || priceRange !== 'All' || activeCategory !== '' || searchQuery !== '' || search !== '';

    return (
        <div className="products-page" style={{ padding: '32px 16px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className="container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
                
                {/* Catalog Header */}
                <div className="products-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {searchQuery || search ? `Search Results: "${searchQuery || search}"` : getActiveCategoryTitle()}
                            <span style={{ fontSize: '13px', background: '#e2e8f0', color: '#334155', padding: '4px 12px', borderRadius: '20px', fontWeight: '700' }}>
                                {filteredProducts.length} Items Found
                            </span>
                        </h1>
                        <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                            Kiskintha Mens Wear — Search products and filter by exact Color and Style
                        </p>
                    </div>

                    {/* Quick Search & Color Filter Section */}
                    <form onSubmit={handleSearchSubmit} className="search-filter-form" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search shirts, color, style..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '14px',
                                flex: '1 1 180px',
                                minWidth: '0',
                                background: '#ffffff',
                                outline: 'none'
                            }}
                        />

                        {/* Dedicated Color Filter Dropdown near Search Bar */}
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: '1 1 140px', minWidth: '0' }}>
                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px 8px 30px',
                                    borderRadius: '8px',
                                    border: selectedColor !== 'All' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: selectedColor !== 'All' ? '#1e40af' : '#334155',
                                    background: selectedColor !== 'All' ? '#eff6ff' : '#ffffff',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    height: '37px'
                                }}
                                title="Filter by Color"
                            >
                                <option value="All">🎨 All Colors</option>
                                <option value="Black">⚫ Black</option>
                                <option value="White">⚪ White</option>
                                <option value="Blue">🔵 Blue</option>
                                <option value="Red">🔴 Red</option>
                                <option value="Green">🟢 Green</option>
                                <option value="Yellow">🟡 Yellow</option>
                                <option value="Pink">🌸 Pink</option>
                                <option value="Brown">🟤 Brown</option>
                                <option value="Grey">🔘 Grey</option>
                                <option value="Other">✨ Other Colors</option>
                            </select>
                            <span style={{ position: 'absolute', left: '10px', pointerEvents: 'none', fontSize: '13px' }}>🎨</span>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '700' }}>
                            🔍 Search
                        </button>
                    </form>
                </div>

                {/* 1. Category Bar Filter */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    marginBottom: '20px',
                    scrollbarWidth: 'thin'
                }}>
                    {categoriesList.map(cat => {
                        const isActive = (cat.id === '' && activeCategory === '') || 
                                         (cat.id !== '' && (String(activeCategory).toLowerCase() === String(cat.id).toLowerCase() || (String(cat.catId) === String(activeCategory) && !cat.sleeve)));
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '800',
                                    border: isActive ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                    background: isActive ? '#2563eb' : '#ffffff',
                                    color: isActive ? '#ffffff' : '#334155',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    whiteSpace: 'nowrap',
                                    boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span>{cat.icon}</span>
                                {cat.name}
                            </button>
                        );
                    })}
                </div>

                {/* High-Visibility Filter & Sort Toolbar */}
                <div className="filter-bar" style={{
                    background: '#ffffff',
                    padding: '22px 24px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                    marginBottom: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🎛️</span> FILTER & REFINE PRODUCTS
                        </h3>
                        {hasActiveFilters && (
                            <button
                                onClick={handleResetAllFilters}
                                style={{
                                    background: '#fee2e2',
                                    border: '1px solid #fca5a5',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    color: '#b91c1c',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                ✕ Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Filter Controls Row */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* ROW 1: Product Type (Full Hand vs Half Hand) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', minWidth: '110px' }}>
                                👔 {activeCategory === '2' ? 'Shirt Style:' : activeCategory === '1' ? 'T-Shirt Style:' : 'Product Type:'}
                            </span>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { 
                                        label: activeCategory === '2' ? 'All Shirts' : activeCategory === '1' ? 'All T-Shirts' : 'All Types', 
                                        value: 'All' 
                                    },
                                    { 
                                        label: activeCategory === '2' ? '👔 Full Hand Shirts' : activeCategory === '1' ? '👔 Full Hand T-Shirts' : '👔 Full Hand', 
                                        value: 'Full Hand' 
                                    },
                                    { 
                                        label: activeCategory === '2' ? '👕 Half Hand Shirts' : activeCategory === '1' ? '👕 Half Hand T-Shirts' : '👕 Half Hand', 
                                        value: 'Half Hand' 
                                    }
                                ].map(t => {
                                    const isSelected = productType === t.value;
                                    return (
                                        <button
                                            key={t.value}
                                            onClick={() => setProductType(t.value)}
                                            style={{
                                                padding: '7px 16px',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: '800',
                                                border: isSelected ? '2px solid #0f172a' : '1px solid #cbd5e1',
                                                background: isSelected ? '#0f172a' : '#ffffff',
                                                color: isSelected ? '#ffffff' : '#334155',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                boxShadow: isSelected ? '0 2px 8px rgba(15,23,42,0.15)' : 'none'
                                            }}
                                        >
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ROW 2: Size, Price Range & Sort Options */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            flexWrap: 'wrap',
                            borderTop: '1px solid #f1f5f9',
                            paddingTop: '14px'
                        }}>
                            {/* Size Filter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>📏 Size:</span>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {['All', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                                        <button
                                            key={sz}
                                            onClick={() => setSelectedSize(sz)}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '800',
                                                border: selectedSize === sz ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                                background: selectedSize === sz ? '#2563eb' : '#ffffff',
                                                color: selectedSize === sz ? '#ffffff' : '#334155',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price / Rate Filter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>💵 Rate:</span>
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '13px',
                                        color: '#0f172a',
                                        fontWeight: '700',
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

                            {/* Sort Filter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>⚡ Sort By:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '13px',
                                        color: '#0f172a',
                                        fontWeight: '700',
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
                    </div>
                </div>

                {/* Active Filter Pills Bar */}
                {hasActiveFilters && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>Active Filters:</span>
                        {productType !== 'All' && (
                            <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Type: {productType}
                                <button onClick={() => setProductType('All')} style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                            </span>
                        )}
                        {selectedColor !== 'All' && (
                            <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Color: {selectedColor}
                                <button onClick={() => setSelectedColor('All')} style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                            </span>
                        )}
                        {selectedSize !== 'All' && (
                            <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Size: {selectedSize}
                                <button onClick={() => setSelectedSize('All')} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                            </span>
                        )}
                        {priceRange !== 'All' && (
                            <span style={{ background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                Price: {priceRange}
                                <button onClick={() => setPriceRange('All')} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                            </span>
                        )}
                    </div>
                )}

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
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{selectedColor !== 'All' ? '🎨' : '🔍'}</div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px' }}>
                            {selectedColor !== 'All' ? 'No products available in this color.' : 'No Matching Products Found'}
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                            {selectedColor !== 'All' 
                                ? `There are currently no products available in ${selectedColor}${productType !== 'All' ? ` (${productType})` : ''}.` 
                                : `No products match your selected criteria.`}
                        </p>
                        <button
                            onClick={handleResetAllFilters}
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
