import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const SUBCATEGORY_MAP = {
  '1': [
    'Formal Shirts',
    'Casual Shirts',
    'Checked Shirts',
    'Cotton Shirts',
    'Linen Shirts'
  ],
  '2': [
    'Jeans',
    'Chinos',
    'Cotton Pants',
    'Cargo Pants',
    'Casual Pants'
  ],
  '3': [
    'Formal Trousers',
    'Slim Fit Trousers',
    'Cotton Trousers',
    'Office Wear Trousers',
    'Casual Trousers'
  ],
  '4': [
    'Polo T-Shirts',
    'Plain T-Shirts',
    'Oversized T-Shirts',
    'Printed T-Shirts',
    'Sports T-Shirts'
  ],
  '5': [
    'Checked Group Shirts',
    'Cotton Group Shirts',
    'Casual Group Shirts',
    'Party Wear Group Shirts',
    'Linen Group Shirts'
  ]
};

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Product State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category_id: '1',
    subcategory: 'Linen Shirts',
    description: '',
    price: '',
    discount_price: '',
    stock_quantity: '50',
    status: 'Active',
    image: '/picture/linen 1.jpg'
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, prodRes, ordRes, custRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/products?limit=200'),
        API.get('/admin/orders'),
        API.get('/admin/customers')
      ]);

      setMetrics(dashRes.data);
      setProducts(prodRes.data.products || []);
      setOrders(ordRes.data || []);
      setCustomers(custRes.data || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChangeInForm = (catId) => {
    const defaultSub = SUBCATEGORY_MAP[catId] ? SUBCATEGORY_MAP[catId][0] : 'General';
    setProdForm({
      ...prodForm,
      category_id: catId,
      subcategory: defaultSub
    });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm(`Are you sure you want to delete Product #${productId}?`)) {
      try {
        await API.delete(`/products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        alert('Failed to delete product: ' + err.message);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category_id: '1',
      subcategory: 'Linen Shirts',
      description: '',
      price: '',
      discount_price: '',
      stock_quantity: '50',
      status: 'Active',
      image: '/picture/linen 1.jpg'
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    const catIdStr = prod.category_id ? String(prod.category_id) : '1';
    setProdForm({
      name: prod.name,
      category_id: catIdStr,
      subcategory: prod.subcategory || (SUBCATEGORY_MAP[catIdStr] ? SUBCATEGORY_MAP[catIdStr][0] : 'General'),
      description: prod.description || '',
      price: prod.price || '',
      discount_price: prod.discount_price || '',
      stock_quantity: prod.stock_quantity || '50',
      status: prod.status || 'Active',
      image: (prod.images && prod.images[0]) || prod.image || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, prodForm);
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...prodForm } : p));
      } else {
        const res = await API.post('/products', prodForm);
        const newProd = { id: res.data.id, ...prodForm, rating: 4.5, review_count: 1 };
        setProducts([newProd, ...products]);
      }
      setShowProductModal(false);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-gold" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  const currentAvailableSubcategories = SUBCATEGORY_MAP[prodForm.category_id] || ['General'];

  return (
    <div className="py-4">
      <div className="container-fluid px-lg-5">
        {/* Admin Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom border-secondary">
          <div>
            <span className="badge bg-danger text-light mb-1">ADMIN MANAGEMENT CONSOLE</span>
            <h2 className="font-heading text-light mb-0">KISKINTHA CONTROL CENTER</h2>
          </div>
          <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
            <button className="btn btn-gold btn-sm" onClick={handleOpenAddModal}>
              <i className="bi bi-plus-circle me-1"></i> Add New Product
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={logout}>
              <i className="bi bi-box-arrow-right me-1"></i> Admin Exit
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <ul className="nav nav-pills mb-4 bg-dark p-2 rounded border border-secondary gap-2">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'overview' ? 'active bg-gold text-dark fw-bold' : 'text-light'}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="bi bi-speedometer2 me-2"></i>Overview Analytics
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'products' ? 'active bg-gold text-dark fw-bold' : 'text-light'}`}
              onClick={() => setActiveTab('products')}
            >
              <i className="bi bi-tags me-2"></i>Products ({products.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active bg-gold text-dark fw-bold' : 'text-light'}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="bi bi-cart-check me-2"></i>Customer Orders ({orders.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'customers' ? 'active bg-gold text-dark fw-bold' : 'text-light'}`}
              onClick={() => setActiveTab('customers')}
            >
              <i className="bi bi-people me-2"></i>Registered Customers ({customers.length})
            </button>
          </li>
        </ul>

        {/* Tab 1: Overview Analytics */}
        {activeTab === 'overview' && (
          <div>
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="kmw-card p-4 border-secondary text-center">
                  <i className="bi bi-box-seam text-gold fs-1 mb-2 d-block"></i>
                  <h6 className="text-muted small">Total Catalog Products</h6>
                  <h2 className="text-light font-heading mb-0">{metrics?.totalProducts || products.length}</h2>
                  <span className="badge bg-gold text-dark mt-2">130 Unique Items</span>
                </div>
              </div>

              <div className="col-md-3">
                <div className="kmw-card p-4 border-secondary text-center">
                  <i className="bi bi-cash-coin text-success fs-1 mb-2 d-block"></i>
                  <h6 className="text-muted small">Gross Revenue (COD)</h6>
                  <h2 className="text-gold font-heading mb-0">₹{(metrics?.totalRevenue || 0).toLocaleString()}</h2>
                  <span className="small text-success mt-2 d-block">100% Cash on Delivery</span>
                </div>
              </div>

              <div className="col-md-3">
                <div className="kmw-card p-4 border-secondary text-center">
                  <i className="bi bi-cart-fill text-warning fs-1 mb-2 d-block"></i>
                  <h6 className="text-muted small">Total Orders Placed</h6>
                  <h2 className="text-light font-heading mb-0">{metrics?.totalOrders || orders.length}</h2>
                  <span className="small text-muted mt-2 d-block">{metrics?.pendingOrders || 0} Pending</span>
                </div>
              </div>

              <div className="col-md-3">
                <div className="kmw-card p-4 border-secondary text-center">
                  <i className="bi bi-people-fill text-info fs-1 mb-2 d-block"></i>
                  <h6 className="text-muted small">Registered Customers</h6>
                  <h2 className="text-light font-heading mb-0">{metrics?.totalCustomers || customers.length}</h2>
                  <span className="small text-info mt-2 d-block">Verified Buyers</span>
                </div>
              </div>
            </div>

            {/* Bestsellers Table */}
            <div className="kmw-card p-4 border-secondary mb-4">
              <h5 className="font-heading text-gold mb-3">BEST SELLING PRODUCTS</h5>
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Subcategory / Type</th>
                      <th>Price</th>
                      <th>Rating</th>
                      <th>Stock Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.filter(p => p.is_bestseller === 1 || p.rating >= 4.8).slice(0, 8).map(p => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td className="fw-semibold text-light">{p.name}</td>
                        <td><span className="badge bg-gold text-dark">{p.category_name || 'Men'}</span></td>
                        <td><span className="badge bg-secondary text-light">{p.subcategory}</span></td>
                        <td className="text-gold fw-bold">₹{(p.discount_price || p.price).toLocaleString()}</td>
                        <td><span className="text-warning">★ {p.rating}</span></td>
                        <td><span className="badge bg-success">In Stock ({p.stock_quantity || 50})</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Products */}
        {activeTab === 'products' && (
          <div className="kmw-card p-4 border-secondary">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="font-heading text-gold mb-0">MANAGE ALL 130 UNIQUE PRODUCTS WITH SUBCATEGORIES</h5>
              <button className="btn btn-gold btn-sm" onClick={handleOpenAddModal}>
                <i className="bi bi-plus-circle me-1"></i> Add Product
              </button>
            </div>

            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="table table-dark table-hover mb-0 align-middle small">
                <thead className="sticky-top bg-dark">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Subcategory / Type</th>
                    <th>Price (₹)</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>
                        <img
                          src={(p.images && p.images[0]) || p.image || '/picture/linen 1.jpg'}
                          alt={p.name}
                          className="rounded"
                          style={{ width: '40px', height: '45px', objectFit: 'cover' }}
                        />
                      </td>
                      <td className="fw-semibold text-light" style={{ maxWidth: '200px' }}>{p.name}</td>
                      <td><span className="badge bg-gold text-dark">{p.category_name || p.category_id}</span></td>
                      <td><span className="badge bg-secondary text-light">{p.subcategory}</span></td>
                      <td className="text-gold fw-bold">₹{(p.discount_price || p.price).toLocaleString()}</td>
                      <td>{p.stock_quantity || 45}</td>
                      <td><span className="badge bg-success">{p.status || 'Active'}</span></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-warning btn-sm py-0 px-2" onClick={() => handleOpenEditModal(p)}>
                            Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm py-0 px-2" onClick={() => handleDeleteProduct(p.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="kmw-card p-4 border-secondary">
            <h5 className="font-heading text-gold mb-3">CUSTOMER ORDERS & STATUS UPDATES</h5>

            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle small">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status Tracker</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="fw-bold text-gold">{ord.order_number}</td>
                      <td className="text-light">{ord.shipping_name}</td>
                      <td className="text-muted">{ord.shipping_phone}</td>
                      <td className="text-muted" style={{ maxWidth: '180px' }}>{ord.shipping_city}, {ord.shipping_pincode}</td>
                      <td className="text-gold fw-bold">₹{parseFloat(ord.total_amount).toLocaleString()}</td>
                      <td><span className="badge bg-secondary">{ord.payment_method || 'Cash on Delivery'}</span></td>
                      <td>
                        <span className={`badge ${ord.status === 'Delivered' ? 'bg-success' : ord.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-dark form-select-sm"
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{ width: '150px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: View Customers */}
        {activeTab === 'customers' && (
          <div className="kmw-card p-4 border-secondary">
            <h5 className="font-heading text-gold mb-3">REGISTERED BUYERS LIST</h5>

            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0 align-middle small">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td className="text-light fw-bold">{c.name}</td>
                      <td className="text-muted">{c.email}</td>
                      <td className="text-muted">{c.phone || c.mobile || 'N/A'}</td>
                      <td className="text-muted">{c.city || 'Chennai'}, {c.state || 'Tamil Nadu'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="modal show d-block bg-dark bg-opacity-75" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-gold">
              <div className="modal-header border-secondary">
                <h5 className="modal-title font-heading text-gold">
                  {editingProduct ? `Edit Product #${editingProduct.id}` : 'Add New Men Wear Product'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowProductModal(false)}></button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small">Product Title *</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        value={prodForm.name}
                        onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small">Category *</label>
                      <select
                        className="form-select form-select-dark"
                        value={prodForm.category_id}
                        onChange={(e) => handleCategoryChangeInForm(e.target.value)}
                      >
                        <option value="1">Shirts (30)</option>
                        <option value="2">Pants (25)</option>
                        <option value="3">Trousers (25)</option>
                        <option value="4">T-Shirts (25)</option>
                        <option value="5">Group Shirts (25)</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Subcategory / Product Type *</label>
                      <select
                        className="form-select form-select-dark"
                        value={prodForm.subcategory}
                        onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                        required
                      >
                        {currentAvailableSubcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">Price (₹) *</label>
                      <input
                        type="number"
                        className="form-control form-control-dark"
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">Discount Price (₹)</label>
                      <input
                        type="number"
                        className="form-control form-control-dark"
                        value={prodForm.discount_price}
                        onChange={(e) => setProdForm({ ...prodForm, discount_price: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control form-control-dark"
                        value={prodForm.stock_quantity}
                        onChange={(e) => setProdForm({ ...prodForm, stock_quantity: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Status</label>
                      <select
                        className="form-select form-select-dark"
                        value={prodForm.status}
                        onChange={(e) => setProdForm({ ...prodForm, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Image URL (Use /picture/linen 1.jpg for local pics)</label>
                      <input
                        type="text"
                        className="form-control form-control-dark"
                        value={prodForm.image}
                        onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small">Description</label>
                      <textarea
                        rows="3"
                        className="form-control form-control-dark"
                        value={prodForm.description}
                        onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-gold">
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
