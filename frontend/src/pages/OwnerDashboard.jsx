import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API, { getImageUrl } from '../api';


function OwnerDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [overview, setOverview] = useState(null);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'customers', 'products', 'overview', 'staff'

    // Selected order for detailed purchase items breakdown modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [statusUpdateMsg, setStatusUpdateMsg] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('All');
    const [orderSearch, setOrderSearch] = useState('');

    // Product Upload/Edit Form State
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [prodForm, setProdForm] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        size: 'S,M,L,XL',
        stock: '50',
        image: null
    });
    const [prodLoading, setProdLoading] = useState(false);
    const [prodMsg, setProdMsg] = useState('');
    const [prodSearch, setProdSearch] = useState('');

    // Owner Product Management Category & Inline Price Editing State
    const [ownerProdCategory, setOwnerProdCategory] = useState('All'); // 'All', '2' (Shirts), '1' (T-Shirts), '4' (Trousers), '3' (Pants), '8' (Group Shirts), '7' (Hoodies)
    const [editingPriceId, setEditingPriceId] = useState(null);
    const [editingPriceVal, setEditingPriceVal] = useState('');
    const [updatingPrice, setUpdatingPrice] = useState(false);

    const fetchData = async (isInitial = false) => {
        if (isInitial) setLoading(true);
        try {
            const [overviewRes, ordersRes, customersRes, productsRes, categoriesRes, staffRes] = await Promise.all([
                API.get('/owner/overview'),
                API.get('/orders'),
                API.get('/admin/customers'),
                API.get('/products'),
                API.get('/categories'),
                API.get('/owner/staff')
            ]);
            setOverview(overviewRes.data);
            setOrders(ordersRes.data || []);
            setCustomers(customersRes.data || []);
            const pData = productsRes.data;
            setProducts(Array.isArray(pData) ? pData : (pData?.products || []));
            setCategories(categoriesRes.data || []);
            setStaff(staffRes.data || []);
        } catch (err) {
            console.error('Error loading Store Owner dashboard data:', err);
            setError('Failed to load Store Owner data. Please verify authorization.');
        } finally {
            if (isInitial) setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'owner') {
            navigate('/login');
            return;
        }

        fetchData(true);

        // Auto-refresh every 3 seconds so numbers increase in real time as orders/customers are added!
        const interval = setInterval(() => {
            fetchData(false);
        }, 3000);

        return () => clearInterval(interval);
    }, [user, navigate]);

    // Handle Order Status Update
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}`, { status: newStatus });
            setStatusUpdateMsg(`✓ Order #${orderId} status updated to ${newStatus}`);
            setTimeout(() => setStatusUpdateMsg(''), 3000);
            fetchData();
        } catch (err) {
            alert('Failed to update order status.');
        }
    };

    // View Order Items Breakdown
    const handleViewOrderDetails = async (order) => {
        setSelectedOrder(order);
        setOrderItems([]);
        setLoadingItems(true);
        try {
            const res = await API.get(`/orders/${order.id}/items`);
            setOrderItems(res.data || []);
        } catch (err) {
            alert('Failed to load order items breakdown.');
        } finally {
            setLoadingItems(false);
        }
    };

    // Product Form Handlers
    const openAddProductModal = () => {
        setEditingProduct(null);
        setProdForm({
            name: '',
            description: '',
            price: '',
            category_id: categories[0]?.id || '1',
            size: 'S,M,L,XL',
            stock: '50',
            image: null
        });
        setProdMsg('');
        setShowProductModal(true);
    };

    const openEditProductModal = (prod) => {
        setEditingProduct(prod);
        setProdForm({
            name: prod.name,
            description: prod.description || '',
            price: prod.price,
            category_id: prod.category_id,
            size: prod.size || 'S,M,L,XL',
            stock: prod.stock || '50',
            image: null
        });
        setProdMsg('');
        setShowProductModal(true);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setProdLoading(true);
        setProdMsg('');

        try {
            const formData = new FormData();
            formData.append('name', prodForm.name);
            formData.append('description', prodForm.description);
            formData.append('price', prodForm.price);
            formData.append('category_id', prodForm.category_id);
            formData.append('size', prodForm.size);
            formData.append('stock', prodForm.stock);
            if (prodForm.image) {
                formData.append('image', prodForm.image);
            }

            if (editingProduct) {
                await API.put(`/products/${editingProduct.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProdMsg('✓ Product updated successfully!');
            } else {
                await API.post('/products', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setProdMsg('✓ Product added to catalog successfully!');
            }

            setTimeout(() => {
                setShowProductModal(false);
                fetchData();
            }, 1200);
        } catch (err) {
            setProdMsg(err.response?.data?.message || 'Error saving product');
        } finally {
            setProdLoading(false);
        }
    };

    const handleSavePrice = async (prodId, newPrice) => {
        const num = parseFloat(newPrice);
        if (isNaN(num) || num <= 0) {
            alert('Please enter a valid price greater than ₹0');
            return;
        }
        setUpdatingPrice(true);
        try {
            await API.patch(`/products/${prodId}/price`, { price: num });
            const updatedProd = products.find(p => p.id === prodId);
            setProducts(prev => prev.map(p => p.id === prodId ? { ...p, price: num } : p));
            setStatusUpdateMsg(`✓ Price updated successfully for "${updatedProd?.name || 'Product'}" to ₹${num.toLocaleString('en-IN')}`);
            setEditingPriceId(null);
            setEditingPriceVal('');
            setTimeout(() => setStatusUpdateMsg(''), 4000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update price. Please try again.');
        } finally {
            setUpdatingPrice(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product from the store catalog?')) return;
        try {
            await API.delete(`/products/${id}`);
            fetchData();
        } catch (err) {
            alert('Failed to delete product.');
        }
    };

    const getImageSrc = (img) => {
        if (!img) return 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80';
        return getImageUrl(img);
    };

    if (loading) return <div className="loading"><div className="spinner"></div><p>Loading Store Owner Executive Portal...</p></div>;
    if (error) return <div className="alert alert-error" style={{ margin: '20px' }}>{error}</div>;

    return (
        <div className="owner-dashboard" style={{ padding: '30px 20px', background: '#f8fafc', minHeight: '85vh' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Banner */}
                <div className="owner-dashboard-header" style={{
                    background: 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)',
                    color: '#fff',
                    padding: '24px 30px',
                    borderRadius: '16px',
                    marginBottom: '24px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #d4af37',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '32px' }}>👑</span>
                            <div>
                                <h1 style={{ margin: 0, fontSize: '26px', color: '#fef08a', letterSpacing: '-0.5px' }}>
                                    Store Owner Control Portal
                                </h1>
                                <p style={{ margin: '4px 0 0', color: '#d4af37', fontSize: '14px', fontWeight: '600' }}>
                                    Kiskintha Mens Wear • Executive Business Operations Dashboard
                                </p>
                                <p style={{ margin: '4px 0 0', color: '#e2e8f0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    📍 Store Address: <strong style={{ color: '#ffffff' }}>{user?.address || 'Kiskintha Mens Wear Main Branch, Chennai'}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={openAddProductModal}
                            style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #b45309 100%)',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(212,175,55,0.4)'
                            }}
                        >
                            ➕ Add New Product
                        </button>
                    </div>
                </div>

                {/* Status Notice */}
                {statusUpdateMsg && (
                    <div className="alert alert-success" style={{ marginBottom: '20px', fontWeight: '600' }}>
                        {statusUpdateMsg}
                    </div>
                )}

                {/* Executive Stat KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                    <div style={{ background: '#ffffff', padding: '22px', borderRadius: '14px', borderLeft: '5px solid #d4af37', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL REVENUE</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#111111', marginTop: '6px' }}>
                            ₹{Number(overview?.totalRevenue || 0).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: '600' }}>✓ Confirmed & Delivered Sales</div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '22px', borderRadius: '14px', borderLeft: '5px solid #1a56db', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL ORDERS PLACED</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a56db', marginTop: '6px' }}>
                            {orders.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Real-time customer purchases</div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '22px', borderRadius: '14px', borderLeft: '5px solid #059669', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>REGISTERED CUSTOMERS</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#059669', marginTop: '6px' }}>
                            {customers.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: '600' }}>Live registered buyers</div>
                    </div>

                    <div style={{ background: '#ffffff', padding: '22px', borderRadius: '14px', borderLeft: '5px solid #7c3aed', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>ACTIVE PRODUCTS</div>
                        <div style={{ fontSize: '28px', fontWeight: '800', color: '#7c3aed', marginTop: '6px' }}>
                            {products.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Catalog inventory items</div>
                    </div>
                </div>

                {/* Dashboard Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
                    <button
                        onClick={() => setActiveTab('orders')}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            background: activeTab === 'orders' ? 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)' : '#ffffff',
                            color: activeTab === 'orders' ? '#fef08a' : '#475569',
                            boxShadow: activeTab === 'orders' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                            border: activeTab === 'orders' ? '1px solid #d4af37' : '1px solid #cbd5e1'
                        }}
                    >
                        🛍️ Customer Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer',
                            background: activeTab === 'customers' ? 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)' : '#ffffff',
                            color: activeTab === 'customers' ? '#fef08a' : '#475569',
                            boxShadow: activeTab === 'customers' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                        }}
                    >
                        👥 Registered Customers ({customers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer',
                            background: activeTab === 'products' ? 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)' : '#ffffff',
                            color: activeTab === 'products' ? '#fef08a' : '#475569',
                            boxShadow: activeTab === 'products' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                        }}
                    >
                        👔 Product Catalog & Stock ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('staff')}
                        style={{
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: 'none',
                            fontWeight: '700',
                            cursor: 'pointer',
                            background: activeTab === 'staff' ? 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)' : '#ffffff',
                            color: activeTab === 'staff' ? '#fef08a' : '#475569'
                        }}
                    >
                        🛡️ Staff Roles ({staff.length})
                    </button>
                </div>

                {/* TAB 1: CUSTOMER ORDERS & LIVE STATUS MANAGEMENT */}
                {activeTab === 'orders' && (
                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>🛍️ Customer Orders Management</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                    View all customer orders, product details, address, payment method, and update order status in real time.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    placeholder="🔍 Search order ID, customer, phone..."
                                    value={orderSearch}
                                    onChange={(e) => setOrderSearch(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '230px' }}
                                />
                                <span style={{ fontSize: '13px', background: '#ecfdf5', color: '#047857', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', border: '1px solid #a7f3d0' }}>
                                    ⚡ Live Sync Active
                                </span>
                            </div>
                        </div>

                        {/* Order Statistics Summary Bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                            <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                                <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase' }}>📊 Total Orders</div>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#1d4ed8', marginTop: '2px' }}>{orders.length}</div>
                            </div>
                            <div style={{ background: '#fffbeb', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                                <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '700', textTransform: 'uppercase' }}>⏳ Pending Orders</div>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#d97706', marginTop: '2px' }}>
                                    {orders.filter(o => (o.status || 'Pending') === 'Pending' || o.status === 'Pending Approval').length}
                                </div>
                            </div>
                            <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                                <div style={{ fontSize: '11px', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>🎉 Delivered Orders</div>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#059669', marginTop: '2px' }}>
                                    {orders.filter(o => o.status === 'Delivered').length}
                                </div>
                            </div>
                            <div style={{ background: '#fef2f2', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                                <div style={{ fontSize: '11px', color: '#b91c1c', fontWeight: '700', textTransform: 'uppercase' }}>❌ Cancelled Orders</div>
                                <div style={{ fontSize: '22px', fontWeight: '800', color: '#dc2626', marginTop: '2px' }}>
                                    {orders.filter(o => (o.status || '').toLowerCase().includes('cancel') || (o.status || '').toLowerCase().includes('reject')).length}
                                </div>
                            </div>
                        </div>

                        {/* Order Status Filter Bar */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', scrollbarWidth: 'thin' }}>
                            {[
                                { id: 'All', label: 'All Orders', count: orders.length },
                                { id: 'Pending', label: '⏳ Pending', count: orders.filter(o => (o.status || 'Pending') === 'Pending' || o.status === 'Pending Approval').length },
                                { id: 'Confirmed', label: '✅ Confirmed', count: orders.filter(o => o.status === 'Confirmed' || o.status === 'Approved & Confirmed').length },
                                { id: 'Packed', label: '📦 Packed', count: orders.filter(o => o.status === 'Packed').length },
                                { id: 'Shipped', label: '🚚 Shipped', count: orders.filter(o => o.status === 'Shipped').length },
                                { id: 'Delivered', label: '🎉 Delivered', count: orders.filter(o => o.status === 'Delivered').length },
                                { id: 'Cancelled', label: '❌ Cancelled', count: orders.filter(o => (o.status || '').toLowerCase().includes('cancel') || (o.status || '').toLowerCase().includes('reject')).length }
                            ].map(st => {
                                const isSelected = orderStatusFilter === st.id;
                                return (
                                    <button
                                        key={st.id}
                                        onClick={() => setOrderStatusFilter(st.id)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                            background: isSelected ? '#2563eb' : '#ffffff',
                                            color: isSelected ? '#ffffff' : '#334155',
                                            boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.2)' : 'none',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        {st.label} ({st.count})
                                    </button>
                                );
                            })}
                        </div>

                        {orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <p style={{ fontSize: '18px' }}>No orders placed yet.</p>
                                <p style={{ fontSize: '13px' }}>When customers place orders, full purchase details will appear here automatically.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', fontSize: '11px', color: '#475569' }}>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Order ID & Date</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Customer & Contact</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Delivery Address</th>
                                            <th style={{ padding: '12px', textAlign: 'left', minWidth: '220px' }}>Ordered Items</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Total & Payment</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Order Status</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>Breakdown</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders
                                            .filter(order => {
                                                // Status Filter
                                                if (orderStatusFilter !== 'All') {
                                                    const cur = order.status || 'Pending';
                                                    if (orderStatusFilter === 'Pending') {
                                                        if (cur !== 'Pending' && cur !== 'Pending Approval') return false;
                                                    } else if (orderStatusFilter === 'Confirmed') {
                                                        if (cur !== 'Confirmed' && cur !== 'Approved & Confirmed') return false;
                                                    } else if (orderStatusFilter === 'Cancelled') {
                                                        if (!cur.toLowerCase().includes('cancel') && !cur.toLowerCase().includes('reject')) return false;
                                                    } else {
                                                        if (cur !== orderStatusFilter) return false;
                                                    }
                                                }
                                                // Search Filter
                                                if (orderSearch.trim()) {
                                                    const s = orderSearch.toLowerCase();
                                                    const matchId = String(order.id).includes(s);
                                                    const matchCust = order.customer_name && order.customer_name.toLowerCase().includes(s);
                                                    const matchPhone = (order.phone || order.customer_phone || '').includes(s);
                                                    const matchAddr = order.address && order.address.toLowerCase().includes(s);
                                                    const matchItems = (order.items || []).some(item => (item.product_name || item.name || '').toLowerCase().includes(s));
                                                    return matchId || matchCust || matchPhone || matchAddr || matchItems;
                                                }
                                                return true;
                                            })
                                            .map(order => {
                                                const formattedDate = order.created_at
                                                    ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                                                    : 'Recently';

                                                // Normalize status value
                                                let currentStatus = order.status || 'Pending';
                                                if (currentStatus === 'Pending Approval') currentStatus = 'Pending';
                                                if (currentStatus === 'Approved & Confirmed') currentStatus = 'Confirmed';
                                                if (currentStatus.toLowerCase().includes('cancel') || currentStatus.toLowerCase().includes('reject')) currentStatus = 'Cancelled';

                                                return (
                                                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                                                        {/* Order ID & Date */}
                                                        <td style={{ padding: '14px 12px' }}>
                                                            <div style={{ fontWeight: '800', color: '#1a56db', fontSize: '14px' }}>
                                                                #{order.id}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                                                📅 {formattedDate}
                                                            </div>
                                                        </td>

                                                        {/* Customer Name & Phone */}
                                                        <td style={{ padding: '14px 12px' }}>
                                                            <div style={{ fontWeight: '700', color: '#0f172a' }}>
                                                                👤 {order.customer_name || 'Customer'}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#1e293b', marginTop: '2px' }}>
                                                                📞 {order.phone || order.customer_phone || 'N/A'}
                                                            </div>
                                                            {order.customer_email && (
                                                                <div style={{ fontSize: '10px', color: '#64748b' }}>
                                                                    ✉️ {order.customer_email}
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* Delivery Address */}
                                                        <td style={{ padding: '14px 12px', maxWidth: '200px', color: '#334155', fontSize: '12px', lineHeight: '1.4' }}>
                                                            📍 {order.address || 'Standard Delivery Address'}
                                                        </td>

                                                        {/* Ordered Products breakdown */}
                                                        <td style={{ padding: '14px 12px' }}>
                                                            {(order.items && order.items.length > 0) ? (
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                                                            <img
                                                                                src={getImageSrc(item.image)}
                                                                                alt={item.product_name || item.name}
                                                                                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    const filename = (item.image || '').split('/').pop();
                                                                                    e.target.src = getImageUrl(filename);
                                                                                }}
                                                                            />
                                                                            <div style={{ fontSize: '12px' }}>
                                                                                <div style={{ fontWeight: '700', color: '#0f172a' }}>
                                                                                    {item.product_name || item.name || 'Kiskintha Item'}
                                                                                </div>
                                                                                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '1px' }}>
                                                                                    {item.category_name && <span style={{ color: '#1e40af', fontWeight: '700' }}>{item.category_name}</span>}
                                                                                    {item.color && <span>🎨 {item.color}</span>}
                                                                                    <span>📏 {item.size || 'M'}</span>
                                                                                    <span style={{ fontWeight: '700', color: '#059669' }}>
                                                                                        {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleViewOrderDetails(order)}
                                                                    style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: '600' }}
                                                                >
                                                                    🔍 View Items
                                                                </button>
                                                            )}
                                                        </td>

                                                        {/* Total Amount & Payment Method */}
                                                        <td style={{ padding: '14px 12px' }}>
                                                            <div style={{ fontWeight: '800', color: '#059669', fontSize: '16px' }}>
                                                                ₹{Number(order.total || 0).toLocaleString('en-IN')}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600', marginTop: '2px' }}>
                                                                💳 {order.payment_method || 'Cash on Delivery (COD)'}
                                                            </div>
                                                        </td>

                                                        {/* Order Status Selector */}
                                                        <td style={{ padding: '14px 12px' }}>
                                                            <select
                                                                value={currentStatus}
                                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                style={{
                                                                    padding: '7px 12px',
                                                                    borderRadius: '8px',
                                                                    fontWeight: '800',
                                                                    fontSize: '12px',
                                                                    border: '1.5px solid #cbd5e1',
                                                                    background: currentStatus === 'Pending' ? '#fef3c7'
                                                                        : currentStatus === 'Confirmed' ? '#e0f2fe'
                                                                        : currentStatus === 'Packed' ? '#f3e8ff'
                                                                        : currentStatus === 'Shipped' ? '#dbeafe'
                                                                        : currentStatus === 'Delivered' ? '#dcfce7'
                                                                        : '#fee2e2',
                                                                    color: currentStatus === 'Pending' ? '#b45309'
                                                                        : currentStatus === 'Confirmed' ? '#0369a1'
                                                                        : currentStatus === 'Packed' ? '#7e22ce'
                                                                        : currentStatus === 'Shipped' ? '#1d4ed8'
                                                                        : currentStatus === 'Delivered' ? '#15803d'
                                                                        : '#b91c1c',
                                                                    cursor: 'pointer',
                                                                    outline: 'none',
                                                                    width: '130px'
                                                                }}
                                                            >
                                                                <option value="Pending">⏳ Pending</option>
                                                                <option value="Confirmed">✅ Confirmed</option>
                                                                <option value="Packed">📦 Packed</option>
                                                                <option value="Shipped">🚚 Shipped</option>
                                                                <option value="Delivered">🎉 Delivered</option>
                                                                <option value="Cancelled">❌ Cancelled</option>
                                                            </select>
                                                        </td>

                                                        {/* Action / Breakdown Modal Trigger */}
                                                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                                            <button
                                                                onClick={() => handleViewOrderDetails(order)}
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)',
                                                                    color: '#fef08a',
                                                                    border: '1px solid #d4af37',
                                                                    padding: '6px 12px',
                                                                    borderRadius: '6px',
                                                                    fontWeight: '700',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                👁️ Breakdown
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: REGISTERED CUSTOMERS DIRECTORY */}
                {activeTab === 'customers' && (
                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ marginBottom: '18px' }}>
                            <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>👥 Registered Customers Directory</h3>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                Live real-time register list of all customers creating an account on Kiskintha Mens Wear
                            </p>
                        </div>

                        {customers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <p style={{ fontSize: '18px' }}>No registered customers found yet.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', fontSize: '11px', color: '#475569' }}>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Customer ID</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Full Name</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Email Address</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Mobile Phone</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Delivery Address Status</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map(cust => (
                                            <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '14px 12px', fontWeight: '800', color: '#7c3aed' }}>
                                                    CUST-{cust.id}
                                                </td>
                                                <td style={{ padding: '14px 12px', fontWeight: '700', color: '#0f172a' }}>
                                                    👤 {cust.name}
                                                </td>
                                                <td style={{ padding: '14px 12px', color: '#1e40af', fontWeight: '600' }}>
                                                    📧 {cust.email}
                                                </td>
                                                <td style={{ padding: '14px 12px', color: '#0f172a' }}>
                                                    📞 {cust.phone || 'N/A'}
                                                </td>
                                                <td style={{ padding: '14px 12px' }}>
                                                    {cust.address && cust.address.length > 3 ? (
                                                        <span style={{ color: '#059669', fontWeight: '600' }}>
                                                            📍 {cust.address}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#d97706', fontSize: '12px', fontStyle: 'italic' }}>
                                                            ⚠️ Pending address entry
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '14px 12px', color: '#64748b' }}>
                                                    📅 {cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-IN') : 'Recently'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: PRODUCT CATALOG & STOCK */}
                {activeTab === 'products' && (
                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>👔 Product Catalog & Price Management</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                    Select a category below to filter products and edit individual product prices in real time.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="text"
                                    placeholder="🔍 Search name or color..."
                                    value={prodSearch}
                                    onChange={(e) => setProdSearch(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '200px' }}
                                />
                                <button
                                    onClick={openAddProductModal}
                                    style={{
                                        background: '#1a56db',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ➕ Add Product
                                </button>
                            </div>
                        </div>

                        {/* Category Filter Pills for Owner */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', scrollbarWidth: 'thin' }}>
                            {[
                                { id: 'All', name: 'All Products', icon: '🛍️', count: products.length },
                                { id: '2', name: 'Shirts', icon: '👔', count: products.filter(p => String(p.category_id) === '2').length },
                                { id: '1', name: 'T-Shirts', icon: '👕', count: products.filter(p => String(p.category_id) === '1').length },
                                { id: '4', name: 'Trousers', icon: '👖', count: products.filter(p => String(p.category_id) === '4').length },
                                { id: '3', name: 'Pants', icon: '👖', count: products.filter(p => String(p.category_id) === '3').length },
                                { id: '8', name: 'Group Shirts', icon: '👔', count: products.filter(p => String(p.category_id) === '8').length },
                                { id: '7', name: 'Hoodies', icon: '🧥', count: products.filter(p => String(p.category_id) === '7').length }
                            ].map(cat => {
                                const isSelected = ownerProdCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setOwnerProdCategory(cat.id);
                                            setEditingPriceId(null);
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                                            background: isSelected ? '#2563eb' : '#ffffff',
                                            color: isSelected ? '#ffffff' : '#334155',
                                            boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.2)' : 'none',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        <span>{cat.icon}</span> {cat.name} ({cat.count})
                                    </button>
                                );
                            })}
                        </div>

                        {/* Products Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', fontSize: '11px', color: '#475569' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Product Image</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Color</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Price (₹)</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products
                                        .filter(p => {
                                            // Category Filter
                                            if (ownerProdCategory !== 'All' && String(p.category_id) !== String(ownerProdCategory)) {
                                                return false;
                                            }
                                            // Search Filter
                                            if (prodSearch.trim()) {
                                                const s = prodSearch.toLowerCase();
                                                const matchName = p.name && p.name.toLowerCase().includes(s);
                                                const matchCat = p.category_name && p.category_name.toLowerCase().includes(s);
                                                const matchColor = p.color && p.color.toLowerCase().includes(s);
                                                return matchName || matchCat || matchColor;
                                            }
                                            return true;
                                        })
                                        .map(prod => {
                                            const isEditingThis = editingPriceId === prod.id;
                                            return (
                                                <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9', background: isEditingThis ? '#f0fdf4' : 'transparent' }}>
                                                    <td style={{ padding: '10px 12px' }}>
                                                        <img
                                                            src={getImageSrc(prod.image)}
                                                            alt={prod.name}
                                                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                const filename = (prod.image || '').split('/').pop();
                                                                e.target.src = getImageUrl(filename);
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a' }}>
                                                        {prod.name}
                                                        {prod.sleeve_type && (
                                                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginTop: '2px' }}>
                                                                {prod.sleeve_type}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '10px 12px' }}>
                                                        <span style={{ background: '#eff6ff', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                                                            {prod.category_name || 'Men Wear'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '10px 12px' }}>
                                                        <span style={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                                                            🎨 {prod.color || 'Assorted'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '10px 12px' }}>
                                                        {isEditingThis ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <span style={{ fontWeight: '800', color: '#059669', fontSize: '15px' }}>₹</span>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    step="1"
                                                                    value={editingPriceVal}
                                                                    onChange={(e) => setEditingPriceVal(e.target.value)}
                                                                    autoFocus
                                                                    style={{
                                                                        width: '95px',
                                                                        padding: '6px 8px',
                                                                        borderRadius: '6px',
                                                                        border: '2px solid #059669',
                                                                        fontWeight: '800',
                                                                        fontSize: '14px',
                                                                        background: '#ffffff',
                                                                        outline: 'none'
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleSavePrice(prod.id, editingPriceVal);
                                                                        if (e.key === 'Escape') setEditingPriceId(null);
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <span style={{ fontSize: '15px', fontWeight: '800', color: '#059669' }}>
                                                                ₹{Number(prod.price).toLocaleString('en-IN')}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '10px 12px', fontWeight: '700' }}>
                                                        {prod.stock > 10 ? (
                                                            <span style={{ color: '#059669' }}>{prod.stock} in stock</span>
                                                        ) : (
                                                            <span style={{ color: '#dc2626' }}>Low: {prod.stock} left</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                        {isEditingThis ? (
                                                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                                                <button
                                                                    onClick={() => handleSavePrice(prod.id, editingPriceVal)}
                                                                    disabled={updatingPrice}
                                                                    style={{
                                                                        background: '#059669',
                                                                        color: '#ffffff',
                                                                        border: 'none',
                                                                        padding: '6px 12px',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '800',
                                                                        fontSize: '12px',
                                                                        boxShadow: '0 2px 6px rgba(5,150,105,0.3)'
                                                                    }}
                                                                >
                                                                    {updatingPrice ? 'Saving...' : '💾 Save Price'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingPriceId(null)}
                                                                    style={{
                                                                        background: '#f1f5f9',
                                                                        color: '#475569',
                                                                        border: '1px solid #cbd5e1',
                                                                        padding: '6px 10px',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '700',
                                                                        fontSize: '12px'
                                                                    }}
                                                                >
                                                                    ✕ Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingPriceId(prod.id);
                                                                        setEditingPriceVal(prod.price);
                                                                    }}
                                                                    style={{
                                                                        background: '#ecfdf5',
                                                                        color: '#047857',
                                                                        border: '1px solid #a7f3d0',
                                                                        padding: '5px 10px',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '700',
                                                                        fontSize: '12px'
                                                                    }}
                                                                >
                                                                    ✏️ Edit Price
                                                                </button>
                                                                <button
                                                                    onClick={() => openEditProductModal(prod)}
                                                                    style={{
                                                                        background: '#fef3c7',
                                                                        color: '#92400e',
                                                                        border: '1px solid #fde68a',
                                                                        padding: '5px 8px',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '700',
                                                                        fontSize: '12px'
                                                                    }}
                                                                >
                                                                    ⚙️ Edit All
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteProduct(prod.id)}
                                                                    style={{
                                                                        background: '#fef2f2',
                                                                        color: '#dc2626',
                                                                        border: '1px solid #fecaca',
                                                                        padding: '5px 8px',
                                                                        borderRadius: '6px',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '700',
                                                                        fontSize: '12px'
                                                                    }}
                                                                >
                                                                    🗑️ Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 4: STAFF & AUTHORITY ROLES */}
                {activeTab === 'staff' && (
                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: '#0f172a' }}>🛡️ Store Staff & System Accounts</h3>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', fontSize: '11px' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Staff Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email Address</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Role Authority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map(s => (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', fontWeight: '700' }}>{s.name}</td>
                                        <td style={{ padding: '12px', color: '#1e40af' }}>{s.email}</td>
                                        <td style={{ padding: '12px' }}>{s.phone || 'N/A'}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                background: s.role === 'owner' ? '#7c3aed' : s.role === 'admin' ? '#059669' : '#0284c7',
                                                color: '#fff'
                                            }}>
                                                {s.role === 'owner' ? '👑 Store Owner' : s.role === 'admin' ? '🛡️ Store Admin' : '👤 Customer'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ORDER ITEMS PURCHASE BREAKDOWN MODAL */}
            {selectedOrder && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-content shadow-gold" style={{ maxWidth: '680px', borderRadius: '16px', padding: '24px' }}>
                        <div className="modal-header" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '14px', marginBottom: '18px' }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#0f172a' }}>🛍️ Order #{selectedOrder.id} Purchase Breakdown</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                                    Customer: <strong>{selectedOrder.customer_name}</strong> ({selectedOrder.customer_email || 'N/A'})
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '13px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <div><strong>Phone:</strong> {selectedOrder.phone || selectedOrder.customer_phone || 'N/A'}</div>
                                    <div><strong>Payment Method:</strong> Cash on Delivery (COD)</div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <strong>Shipment Delivery Address:</strong> {selectedOrder.address || 'Standard Address'}
                                    </div>
                                </div>
                            </div>

                            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: '#0f172a' }}>Purchased Items Breakdown:</h4>

                            {loadingItems ? (
                                <div className="loading"><div className="spinner"></div><p>Fetching order items breakdown...</p></div>
                            ) : orderItems.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: '13px' }}>Item details recorded for order #{selectedOrder.id}.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {orderItems.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#ffffff', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img
                                                    src={getImageSrc(item.image)}
                                                    alt={item.product_name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{item.product_name}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                                        Size: <span style={{ fontWeight: '700', color: '#1a56db' }}>{item.size || 'M'}</span> | Qty: <span style={{ fontWeight: '700' }}>{item.quantity}</span> × ₹{Number(item.price).toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #e2e8f0', paddingTop: '12px', marginTop: '8px', fontSize: '16px', fontWeight: '800' }}>
                                        <span>Total Order Amount:</span>
                                        <span style={{ color: '#059669', fontSize: '18px' }}>₹{Number(selectedOrder.total || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                                Close Breakdown
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCT ADD/EDIT MODAL */}
            {showProductModal && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                    <div className="modal-content shadow-gold" style={{ maxWidth: '580px', borderRadius: '16px', padding: '24px' }}>
                        <div className="modal-header" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                            <h3>{editingProduct ? '✏️ Edit Catalog Product' : '➕ Add New Product to Catalog'}</h3>
                            <button className="close-btn" onClick={() => setShowProductModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {prodMsg && <div className="alert alert-info" style={{ marginBottom: '14px' }}>{prodMsg}</div>}

                            <form onSubmit={handleProductSubmit}>
                                <div className="form-group" style={{ marginBottom: '12px' }}>
                                    <label style={{ fontWeight: '600', fontSize: '13px' }}>Product Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={prodForm.name}
                                        onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', fontSize: '13px' }}>Price (₹) *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={prodForm.price}
                                            onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', fontSize: '13px' }}>Category *</label>
                                        <select
                                            className="form-control"
                                            value={prodForm.category_id}
                                            onChange={(e) => setProdForm({ ...prodForm, category_id: e.target.value })}
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', fontSize: '13px' }}>Stock Inventory *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={prodForm.stock}
                                            onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ fontWeight: '600', fontSize: '13px' }}>Available Sizes</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={prodForm.size}
                                            onChange={(e) => setProdForm({ ...prodForm, size: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '12px' }}>
                                    <label style={{ fontWeight: '600', fontSize: '13px' }}>Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        value={prodForm.description}
                                        onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ fontWeight: '600', fontSize: '13px' }}>Product Photo (JPG/PNG)</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => setProdForm({ ...prodForm, image: e.target.files[0] })}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn btn-gold" style={{ flex: 1 }} disabled={prodLoading}>
                                        {prodLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add to Catalog'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerDashboard;
