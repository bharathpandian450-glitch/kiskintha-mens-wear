import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import { useAuth } from './context/AuthContext';

// Global Scroll-to-Top Handler for route transitions
function ScrollToTop() {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname, search]);

    return null;
}

// Protected Route Component for Authenticated Users
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/welcome" replace />;
    }
    return children;
}

// Protected Route Component for Store Owner & Admin (Redirects unauthenticated to Login, customers to Home)
function ProtectedOwnerRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="loading" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (user.role !== 'owner' && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    const { user } = useAuth();
    const location = useLocation();
    const showHeaderAndFooter = location.pathname !== '/welcome';

    return (
        <div className="app">
            <ScrollToTop />
            {/* Display Navbar across all pages except the splash Welcome card */}
            {showHeaderAndFooter && <Navbar />}

            <main className="main-content">
                <Routes>
                    {/* Welcome & Authentication Flow Routes - Accessible without premature redirect */}
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Shop Routes (Require Login First) */}
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                    <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/admin" element={<Navigate to="/owner" replace />} />
                    <Route path="/owner" element={<ProtectedOwnerRoute><OwnerDashboard /></ProtectedOwnerRoute>} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to={user ? "/" : "/welcome"} replace />} />
                </Routes>
            </main>

            {/* Display Footer across all pages except the splash Welcome card */}
            {showHeaderAndFooter && <Footer />}
        </div>
    );
}

export default App;
