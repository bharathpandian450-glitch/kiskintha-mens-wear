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
                        🛍️ All Customer Purchases ({orders.length})
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
                        👥 Registered Customers Directory ({customers.length})
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
                        🛡️ Staff & Authority Roles ({staff.length})
                    </button>
                </div>

                {/* TAB 1: ALL CUSTOMER ORDERS & COMPLETE PURCHASE DETAILS */}
                {activeTab === 'orders' && (
                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>🛍️ Customer Purchases & Orders Log</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                    Full purchase details including customer name, contact, delivery address, order total, and purchased item breakdown
                                </p>
                            </div>
                            <span style={{ fontSize: '13px', background: '#ecfdf5', color: '#047857', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', border: '1px solid #a7f3d0' }}>
                                Live Order Tracking Active
                            </span>
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
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Customer Name</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Email / Phone</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Delivery Address</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Total (₹)</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '14px 12px', fontWeight: '800', color: '#1a56db' }}>
                                                    #{order.id}
                                                </td>
                                                <td style={{ padding: '14px 12px', fontWeight: '700', color: '#0f172a' }}>
                                                    👤 {order.customer_name || 'Customer'}
                                                </td>
                                                <td style={{ padding: '14px 12px' }}>
                                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{order.customer_email || 'N/A'}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>📞 {order.phone || order.customer_phone || 'N/A'}</div>
                                                </td>
                                                <td style={{ padding: '14px 12px', maxWidth: '240px', color: '#334155' }}>
                                                    📍 {order.address || 'Standard Delivery Address'}
                                                </td>
                                                <td style={{ padding: '14px 12px', fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                                                    ₹{Number(order.total || 0).toLocaleString('en-IN')}
                                                    <div style={{ fontSize: '10px', color: '#b45309', fontWeight: '700', marginTop: '2px' }}>
                                                        📱 {order.payment_method || 'UPI QR (bharathpandian450-1@okhdfcbank)'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 12px' }}>
                                                    {order.status === 'Pending Approval' || order.status === 'Pending' ? (
                                                        <span style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '20px',
                                                            fontSize: '11px',
                                                            fontWeight: '800',
                                                            background: '#fef3c7',
                                                            color: '#b45309',
                                                            border: '1px solid #fde68a',
                                                            display: 'inline-block',
                                                            marginBottom: '6px'
                                                        }}>
                                                            ⏳ Pending Owner Approval
                                                        </span>
                                                    ) : (
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                            style={{
                                                                padding: '6px 10px',
                                                                borderRadius: '6px',
                                                                fontWeight: '700',
                                                                fontSize: '12px',
                                                                border: '1px solid #cbd5e1',
                                                                background: order.status.includes('Approved') || order.status === 'Confirmed' || order.status === 'Delivered' ? '#dcfce7' : order.status === 'Shipped' ? '#dbeafe' : '#f1f5f9',
                                                                color: order.status.includes('Approved') || order.status === 'Confirmed' || order.status === 'Delivered' ? '#15803d' : order.status === 'Shipped' ? '#1d4ed8' : '#334155',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="Pending Approval">Pending Approval</option>
                                                            <option value="Approved & Confirmed">Approved & Confirmed</option>
                                                            <option value="Shipped">Shipped</option>
                                                            <option value="Delivered">Delivered</option>
                                                            <option value="Rejected & Cancelled">Rejected & Cancelled</option>
                                                        </select>
                                                    )}

                                                    {(order.status === 'Pending Approval' || order.status === 'Pending') && (
                                                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                                            <button
                                                                onClick={() => handleStatusChange(order.id, 'Approved & Confirmed')}
                                                                style={{
                                                                    background: '#059669',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    fontWeight: '700',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                ✅ Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(order.id, 'Rejected & Cancelled')}
                                                                style={{
                                                                    background: '#dc2626',
                                                                    color: '#fff',
                                                                    border: 'none',
                                                                    padding: '4px 8px',
                                                                    borderRadius: '4px',
                                                                    fontWeight: '700',
                                                                    fontSize: '11px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                ❌ Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleViewOrderDetails(order)}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #111111 0%, #1e1e1e 100%)',
                                                            color: '#fef08a',
                                                            border: '1px solid #d4af37',
                                                            padding: '6px 14px',
                                                            borderRadius: '6px',
                                                            fontWeight: '700',
                                                            fontSize: '12px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        👁️ View Purchase Breakdown
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                                <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>👔 Product Catalog & Stock Inventory ({products.length} Items)</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>
                                    Manage store prices, descriptions, inventory stock levels, and product pictures
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="🔍 Search catalog products..."
                                    value={prodSearch}
                                    onChange={(e) => setProdSearch(e.target.value)}
                                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '220px' }}
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

                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textTransform: 'uppercase', fontSize: '11px', color: '#475569' }}>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Product Image</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Price (₹)</th>
                                        <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                                        <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products
                                        .filter(p => !prodSearch.trim() || p.name.toLowerCase().includes(prodSearch.toLowerCase()) || (p.category_name && p.category_name.toLowerCase().includes(prodSearch.toLowerCase())))
                                        .map(prod => (
                                        <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px 12px' }}>
                                                <img
                                                    src={getImageSrc(prod.image)}
                                                    alt={prod.name}
                                                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                />
                                            </td>
                                            <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0f172a' }}>
                                                {prod.name}
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
                                                    {prod.category_name || 'Men Wear'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', fontWeight: '800', color: '#059669' }}>
                                                ₹{Number(prod.price).toLocaleString('en-IN')}
                                            </td>
                                            <td style={{ padding: '10px 12px', fontWeight: '700' }}>
                                                {prod.stock > 10 ? (
                                                    <span style={{ color: '#059669' }}>{prod.stock} in stock</span>
                                                ) : (
                                                    <span style={{ color: '#dc2626' }}>Low: {prod.stock} left</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => openEditProductModal(prod)}
                                                    style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '6px', fontWeight: '700', fontSize: '12px' }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(prod.id)}
                                                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px' }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
