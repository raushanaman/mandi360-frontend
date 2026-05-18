import './styles/Global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/common/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopOnboard from './pages/ShopOnboard';
import ShopProfile from './pages/ShopProfile';
import Cart from './pages/Cart';
import Products from './pages/Products';
import AllShops from './pages/AllShops';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import AdminPanel from './pages/AdminPanel';
import MerchantDashboard from './pages/MerchantDashboard';
import OrderTracking from './pages/OrderTracking';
import MerchantOrders from './pages/MerchantOrders';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import SearchResults from './pages/SearchResults';
import { NewArrivals, LocalDeals, ShippingPolicy, HelpCenter, ContactUs, PrivacyPolicy, TermsOfService, CookiesPolicy } from './pages/FooterPages';

const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <span className="text-6xl mb-4">🚧</span>
    <h2 className="text-4xl font-black text-slate-900 mb-3">Coming Soon</h2>
    <p className="text-slate-500">This page is under construction. Check back later!</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Auth routes — no header/footer */}
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Main app routes */}
            <Route path="/*" element={
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/"               element={<Home />} />
                    <Route path="/shops"          element={<AllShops />} />
                    <Route path="/products"       element={<PrivateRoute><Products /></PrivateRoute>} />
                    <Route path="/products/:category" element={<PrivateRoute><Products /></PrivateRoute>} />
                    <Route path="/shop/:id"       element={<PrivateRoute><ShopProfile /></PrivateRoute>} />
                    <Route path="/register-shop"  element={<PrivateRoute><ShopOnboard /></PrivateRoute>} />
                    <Route path="/cart"           element={<PrivateRoute><Cart /></PrivateRoute>} />
                    <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                    <Route path="/admin"          element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
                    <Route path="/dashboard"      element={<PrivateRoute><MerchantDashboard /></PrivateRoute>} />
                    <Route path="/merchant/orders" element={<PrivateRoute><MerchantOrders /></PrivateRoute>} />
                    <Route path="/orders"          element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
                    <Route path="/wishlist"         element={<PrivateRoute><Wishlist /></PrivateRoute>} />
                    <Route path="/search"           element={<SearchResults />} />
                    <Route path="/new-arrivals"      element={<NewArrivals />} />
                    <Route path="/deals"             element={<LocalDeals />} />
                    <Route path="/shipping"          element={<ShippingPolicy />} />
                    <Route path="/help"              element={<HelpCenter />} />
                    <Route path="/contact"           element={<ContactUs />} />
                    <Route path="/privacy"           element={<PrivacyPolicy />} />
                    <Route path="/terms"             element={<TermsOfService />} />
                    <Route path="/cookies"           element={<CookiesPolicy />} />
                    <Route path="/product/:productId" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
                    <Route path="*"               element={<ComingSoon />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
