import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/custom.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ShirtsPage from './pages/ShirtsPage';
import PantsPage from './pages/PantsPage';
import TrousersPage from './pages/TrousersPage';
import TShirtsPage from './pages/TShirtsPage';
import GroupShirtsPage from './pages/GroupShirtsPage';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import MyAccount from './pages/MyAccount';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shirts" element={<ShirtsPage />} />
                <Route path="/pants" element={<PantsPage />} />
                <Route path="/trousers" element={<TrousersPage />} />
                <Route path="/t-shirts" element={<TShirtsPage />} />
                <Route path="/group-shirts" element={<GroupShirtsPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/search" element={<SearchResults />} />
                
                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<AboutUs />} />
                
                {/* Admin Auth */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected User Routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

                {/* Admin Dashboard */}
                <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

                {/* Catch All */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
