import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// Admin / Manager Pages
import AdminLayout from './components/AdminLayout';
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));

function App() {
    return (
        <>
            <Navbar />
            <CartDrawer />
            <Suspense fallback={<div className="loader"><div className="spinner"></div></div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Admin / Manager Routes */}
                    <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
                    <Route path="/admin/reports" element={<AdminLayout><Dashboard /></AdminLayout>} />
                    <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
                    <Route path="/admin/orders" element={<AdminLayout><OrderManagement /></AdminLayout>} />
                </Routes>
            </Suspense>
            <Footer />
        </>
    );
}

export default App;
