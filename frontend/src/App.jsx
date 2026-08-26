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

// Public Auth Route Component (Redirects to Home if already logged in)
function PublicAuthRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    const { user } = useAuth();

    return (
        <div className="app">
            <ScrollToTop />
            {/* Display Navbar only when user is logged in */}
            {user && <Navbar />}

            <main className="main-content">
                <Routes>
                    {/* Welcome & Authentication Flow Routes */}
                    <Route path="/welcome" element={<PublicAuthRoute><Welcome /></PublicAuthRoute>} />
                    <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
                    <Route path="/register" element={<PublicAuthRoute><Register /></PublicAuthRoute>} />

                    {/* Protected Shop Routes (Require Login First) */}
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                    <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/admin" element={<Navigate to="/owner" replace />} />
                    <Route path="/owner" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to={user ? "/" : "/welcome"} replace />} />
                </Routes>
            </main>

            {/* Display Footer only when user is logged in */}
            {user && <Footer />}
        </div>
    );
}

export default App;
