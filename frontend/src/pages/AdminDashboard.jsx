import { useEffect, useState } from 'react';
import API, { getImageUrl } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const getImageSrc = (img) => getImageUrl(img);


function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalCustomers: 0, totalRevenue: 0 });
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Product Upload / Edit State
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category_id: '', size: '', stock: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Category State
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryError, setNewCategoryError] = useState('');
    const [newProductError, setNewProductError] = useState('');

    const isOwner = user?.role === 'owner' || user?.role === 'admin';

    // Protect route
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
            navigate('/login');
        }
    }, [user, navigate]);

    const fetchAll = async () => {
        try {
            const [statsRes, catRes, prodRes, orderRes, custRes] = await Promise.all([
                API.get('/admin/stats').catch(e => ({ data: {} })),
                API.get('/categories').catch(e => ({ data: [] })),
                API.get('/products').catch(e => ({ data: [] })),
                API.get('/orders').catch(e => ({ data: [] })),
                API.get('/admin/customers').catch(e => ({ data: [] }))
            ]);
            setStats(statsRes.data || {});
            setCategories(Array.isArray(catRes.data) ? catRes.data : []);
            setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.products || []));
            setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
            setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Handle Image file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Start editing product
    const handleStartEdit = (prod) => {
        setEditingProduct(prod);
        setNewProduct({
            name: prod.name,
            description: prod.description || '',
            price: prod.price,
            category_id: prod.category_id || '',
            size: prod.size || 'S,M,L,XL',
            stock: prod.stock || 0
        });
        setImageFile(null);
        setImagePreview(prod.image ? getImageSrc(prod.image) : null);
        window.scrollTo({ top: 380, behavior: 'smooth' });
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditingProduct(null);
        setNewProduct({ name: '', description: '', price: '', category_id: '', size: '', stock: '' });
        setImageFile(null);
        setImagePreview(null);
        setNewProductError('');
    };

    // Handlers for adding category (Owner only)
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setNewCategoryError('');
        if (!isOwner) return setNewCategoryError('Only Store Owner can add categories');
        if (!newCategory.trim()) return setNewCategoryError('Category name required');
        try {
            await API.post('/categories', { name: newCategory });
            setNewCategory('');
            await fetchAll();
        } catch (err) {
            setNewCategoryError(err.response?.data?.message || 'Failed to add category');
        }
    };

    // Handlers for Save / Update product (Owner only)
    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setNewProductError('');
        if (!isOwner) return setNewProductError('Only Store Owner can upload or edit products and pictures');
        const { name, description, price, category_id, size, stock } = newProduct;
        if (!name || !price || !category_id) return setNewProductError('Name, price and category are required');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category_id', category_id);
            formData.append('size', size || 'S,M,L,XL');
            formData.append('stock', stock || 0);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editingProduct) {
                // PUT update product
                await API.put(`/products/${editingProduct.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                // POST create new product
                await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }

            handleCancelEdit();
            await fetchAll();
        } catch (err) {
            setNewProductError(err.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!isOwner) return alert('Only Store Owner can delete products');
        if (!window.confirm('Delete this product?')) return;
        try {
            await API.delete(`/products/${id}`);
            await fetchAll();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!isOwner) return alert('Only Store Owner can delete categories');
        if (!window.confirm('Delete this category?')) return;
        try {
            await API.delete(`/categories/${id}`);
            await fetchAll();
        } catch (err) {
            alert('Failed to delete category');
        }
    };

    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}`, { status: newStatus });
            await fetchAll();
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div><p>Loading management data...</p></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="admin-page">
            <div className="container">
                <h1>{isOwner ? '👑 Store Owner Management Portal' : '🛡️ Admin Management Portal'}</h1>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                    {isOwner
                        ? 'As the Store Owner, you have full authority to upload, edit, add pictures, and delete products, categories, and manage store operations.'
                        : 'As an Admin, you can view product listings, customer records, and update order statuses. Product uploads and editing are restricted to the Store Owner.'}
                </p>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="label">Total Products</div>
                        <div className="value">{stats.totalProducts}</div>
                    </div>
                    <div className="stat-card">
                        <div className="label">Total Orders</div>
                        <div className="value">{stats.totalOrders}</div>
                    </div>
                    <div className="stat-card">
                        <div className="label">Total Customers</div>
                        <div className="value">{stats.totalCustomers}</div>
                    </div>
                    <div className="stat-card">
                        <div className="label">Total Revenue</div>
                        <div className="value">₹{Number(stats.totalRevenue).toLocaleString('en-IN')}</div>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="admin-tabs">
                    <button className={`admin-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Products</button>
                    <button className={`admin-tab ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>Categories</button>
                    <button className={`admin-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders</button>
                    <button className={`admin-tab ${tab === 'customers' ? 'active' : ''}`} onClick={() => setTab('customers')}>Customers</button>
                </div>

                <div className="admin-panel">
                    {tab === 'products' && (
                        <>
                            <h3>All Products</h3>

                            {isOwner ? (
                                <div className="admin-form" style={{ background: editingProduct ? '#f0fdf4' : '#faf5ff', border: editingProduct ? '2px solid #059669' : '1px solid #e9d5ff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h4 style={{ color: editingProduct ? '#059669' : '#7c3aed', margin: 0 }}>
                                            {editingProduct ? `✏️ Edit Product Details (ID #${editingProduct.id})` : '👑 Upload New Product & Picture'}
                                        </h4>
                                        {editingProduct && (
                                            <button type="button" className="btn btn-sm btn-secondary" onClick={handleCancelEdit}>
                                                ✕ Cancel Edit
                                            </button>
                                        )}
                                    </div>

                                    {newProductError && <div className="alert alert-error">{newProductError}</div>}

                                    <form onSubmit={handleSaveProduct}>
                                        <div className="form-group">
                                            <label>Product Name</label>
                                            <input type="text" className="form-control" placeholder="e.g. Royal Silk Blue Shirt" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea className="form-control" placeholder="Product details, fabric quality, style..." value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Price (₹)</label>
                                                <input type="number" className="form-control" placeholder="999" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select className="form-control" value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: e.target.value })} required>
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Available Sizes</label>
                                                <input type="text" className="form-control" placeholder="S,M,L,XL" value={newProduct.size} onChange={e => setNewProduct({ ...newProduct, size: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Stock Quantity</label>
                                                <input type="number" className="form-control" placeholder="50" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                            </div>
                                        </div>

                                        {/* Product Picture Upload */}
                                        <div className="form-group" style={{ background: '#fff', padding: '14px', borderRadius: '10px', border: '1px dashed #7c3aed', marginBottom: '16px' }}>
                                            <label style={{ fontWeight: '600', color: '#7c3aed', display: 'block', marginBottom: '6px' }}>📷 {editingProduct ? 'Update Product Picture (Optional)' : 'Upload Product Picture'}</label>
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                                            {imagePreview && (
                                                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img src={imagePreview} alt="Selected Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #7c3aed' }} />
                                                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>✓ Picture ready</span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" className="btn" style={{ background: editingProduct ? '#059669' : '#7c3aed', color: '#fff', fontWeight: '600', flex: 1, padding: '12px' }}>
                                                {editingProduct ? '💾 Save Changes' : '👑 Upload Product & Picture'}
                                            </button>

                                            {editingProduct && (
                                                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} style={{ padding: '12px 20px' }}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="alert" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                                    🔒 <strong>Notice:</strong> Product upload and editing permissions are reserved exclusively for the Store Owner (`owner@kiskinthamenswear.com`).
                                </div>
                            )}

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Picture</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price (₹)</th>
                                        <th>Stock</th>
                                        {isOwner && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                {p.image ? (
                                                    <img src={getImageSrc(p.image)} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                                                ) : (
                                                    <span style={{ fontSize: '24px' }}>👔</span>
                                                )}
                                            </td>
                                            <td style={{ fontWeight: '600' }}>{p.name}</td>
                                            <td>{p.category_name}</td>
                                            <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                                            <td>{p.stock}</td>
                                            {isOwner && (
                                                <td className="actions" style={{ display: 'flex', gap: '6px' }}>
                                                    <button className="btn btn-sm btn-primary" onClick={() => handleStartEdit(p)} style={{ background: '#1a56db' }}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id)}>
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={isOwner ? 6 : 5} style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                                No products uploaded yet. {isOwner ? 'Use the form above to upload product details and pictures!' : 'Owner will upload products soon.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {tab === 'categories' && (
                        <>
                            <h3>All Categories</h3>

                            {isOwner ? (
                                <div className="admin-form" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                                    <h4 style={{ color: '#7c3aed' }}>👑 Add New Category (Owner Privileges)</h4>
                                    {newCategoryError && <div className="alert alert-error">{newCategoryError}</div>}
                                    <form onSubmit={handleAddCategory}>
                                        <div className="form-group">
                                            <label>Category Name</label>
                                            <input type="text" className="form-control" placeholder="e.g. Traditional Wear" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                                        </div>
                                        <button type="submit" className="btn" style={{ background: '#7c3aed', color: '#fff', fontWeight: '600' }}>Add Category</button>
                                    </form>
                                </div>
                            ) : (
                                <div className="alert" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
                                    🔒 Category management permissions are reserved for the Store Owner.
                                </div>
                            )}

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        {isOwner && <th>Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: '600' }}>{c.name}</td>
                                            {isOwner && (
                                                <td className="actions">
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCategory(c.id)}>Delete</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {tab === 'orders' && (
                        <>
                            <h3>All Customer Orders</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#ID</th>
                                        <th>Customer</th>
                                        <th>Total (₹)</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id}>
                                            <td>#{o.id}</td>
                                            <td style={{ fontWeight: '600' }}>{o.customer_name}</td>
                                            <td>₹{Number(o.total).toLocaleString('en-IN')}</td>
                                            <td>
                                                <span className={`badge ${o.status === 'Delivered' ? 'badge-success' : o.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>{new Date(o.created_at).toLocaleDateString()}</td>
                                            <td className="actions">
                                                <select className="status-select" value={o.status} onChange={e => handleOrderStatusChange(o.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px' }}>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                                No customer orders placed yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}

                    {tab === 'customers' && (
                        <>
                            <h3>Registered Customers</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: '600' }}>{c.name}</td>
                                            <td>{c.email}</td>
                                            <td>{c.phone || 'N/A'}</td>
                                            <td>{new Date(c.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {customers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                                                No registered customers yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
