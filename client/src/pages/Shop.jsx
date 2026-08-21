import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const Shop = ({ initialCategory = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(12);

  // Filters State
  const [category, setCategory] = useState(initialCategory || searchParams.get('category') || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchSubcategories();
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [category, selectedSubcategory, minPrice, maxPrice, selectedSize, selectedColor, minRating, sort, page, limit, searchParams]);

  const fetchSubcategories = async () => {
    try {
      const activeCat = category || initialCategory;
      const res = await API.get(`/categories/subcategories${activeCat ? `?category=${activeCat}` : ''}`);
      setSubcategories(res.data || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      const search = searchParams.get('search') || searchParams.get('q');
      if (search) params.append('search', search);

      const catToUse = category || searchParams.get('category') || initialCategory;
      if (catToUse) params.append('category', catToUse);
      if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (selectedSize) params.append('size', selectedSize);
      if (selectedColor) params.append('color', selectedColor);
      if (minRating) params.append('minRating', minRating);
      if (sort) params.append('sort', sort);

      if (searchParams.get('bestseller')) params.append('bestseller', 'true');
      if (searchParams.get('newArrivals')) params.append('newArrivals', 'true');
      if (searchParams.get('trending')) params.append('trending', 'true');

      params.append('page', page);
      params.append('limit', limit);

      const res = await API.get(`/products?${params.toString()}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching shop products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setCategory(initialCategory || '');
    setSelectedSubcategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setMinRating('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const handleSelectSubcategoryPill = (subName) => {
    if (selectedSubcategory === subName) {
      setSelectedSubcategory('');
    } else {
      setSelectedSubcategory(subName);
    }
    setPage(1);
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-3 border-bottom border-secondary">
          <div>
            <h2 className="font-heading text-light mb-1">
              {initialCategory 
                ? `${initialCategory.toUpperCase()} COLLECTION` 
                : searchParams.get('search')
                  ? `Search Results for "${searchParams.get('search')}"`
                  : "MEN'S CLOTHING CATALOG"}
            </h2>
            <p className="text-muted small mb-0">
              Showing {products.length} of {total} items (Page {page} of {totalPages})
              {selectedSubcategory && <span className="badge bg-gold text-dark ms-2">Filtered: {selectedSubcategory}</span>}
            </p>
          </div>

          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            <span className="text-muted small">Sort by:</span>
            <select
              className="form-select form-select-dark form-select-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
            </select>

            <select
              className="form-select form-select-dark form-select-sm"
              value={limit}
              onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
              style={{ width: '110px' }}
            >
              <option value="12">12 / page</option>
              <option value="20">20 / page</option>
            </select>
          </div>
        </div>

        {/* Subcategory Pills Bar */}
        {subcategories.length > 0 && (
          <div className="mb-4 overflow-auto pb-2">
            <div className="d-flex gap-2 flex-nowrap align-items-center">
              <span className="text-gold font-heading small me-1 fw-bold text-nowrap">Filter Type:</span>
              <button
                type="button"
                className={`btn btn-sm text-nowrap rounded-pill px-3 ${!selectedSubcategory ? 'btn-gold' : 'btn-outline-secondary text-muted'}`}
                onClick={() => { setSelectedSubcategory(''); setPage(1); }}
              >
                All {initialCategory ? initialCategory : 'Types'}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  className={`btn btn-sm text-nowrap rounded-pill px-3 ${selectedSubcategory === sub.name ? 'btn-gold' : 'btn-outline-secondary text-muted'}`}
                  onClick={() => handleSelectSubcategoryPill(sub.name)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* Filters Sidebar */}
          <div className="col-lg-3">
            <div className="filter-sidebar">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="filter-title mb-0">Refine Search</h5>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-gold p-0 text-decoration-none"
                  onClick={handleResetFilters}
                >
                  Reset All
                </button>
              </div>

              {/* Category Filter */}
              {!initialCategory && (
                <div className="mb-4">
                  <label className="form-label text-gold small font-heading">Category</label>
                  <select
                    className="form-select form-select-dark form-select-sm"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setSelectedSubcategory(''); setPage(1); }}
                  >
                    <option value="">All Categories (130 Items)</option>
                    <option value="shirts">Shirts (30)</option>
                    <option value="pants">Pants (25)</option>
                    <option value="trousers">Trousers (25)</option>
                    <option value="t-shirts">T-Shirts (25)</option>
                    <option value="group-shirts">Group Shirts (25)</option>
                  </select>
                </div>
              )}

              {/* Subcategory Dropdown Filter */}
              <div className="mb-4">
                <label className="form-label text-gold small font-heading">Product Type / Subcategory</label>
                <select
                  className="form-select form-select-dark form-select-sm"
                  value={selectedSubcategory}
                  onChange={(e) => { setSelectedSubcategory(e.target.value); setPage(1); }}
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <label className="form-label text-gold small font-heading">Price Range (₹)</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    className="form-control form-control-dark form-control-sm"
                    placeholder="Min ₹"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-muted align-self-center">-</span>
                  <input
                    type="number"
                    className="form-control form-control-dark form-control-sm"
                    placeholder="Max ₹"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-4">
                <label className="form-label text-gold small font-heading">Available Size</label>
                <div className="d-flex flex-wrap gap-1">
                  {['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`btn btn-sm ${selectedSize === sz ? 'btn-gold' : 'btn-outline-secondary text-muted'}`}
                      onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating Filter */}
              <div className="mb-4">
                <label className="form-label text-gold small font-heading">Rating Filter</label>
                <select
                  className="form-select form-select-dark form-select-sm"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5★ & Above</option>
                  <option value="4.0">4.0★ & Above</option>
                </select>
              </div>

              <div className="bg-secondary bg-opacity-25 p-3 rounded text-center small text-muted">
                <i className="bi bi-shield-check text-gold fs-5 mb-1 d-block"></i>
                Cash on Delivery Available for all 130 items
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-gold" role="status">
                  <span className="visually-hidden">Loading catalog...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5 bg-dark rounded border border-secondary p-5">
                <i className="bi bi-search fs-1 text-gold mb-3 d-block"></i>
                <h4 className="font-heading text-light">No Products Match Your Criteria</h4>
                <p className="text-muted">Try adjusting your subcategory pills or resetting filters.</p>
                <button className="btn btn-gold mt-2" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {products.map((prod) => (
                    <div key={prod.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                      <ProductCard product={prod} />
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
