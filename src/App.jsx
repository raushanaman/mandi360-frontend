
import './styles/Global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShopOnboard from './pages/ShopOnboard';
import ShopProfile from './pages/ShopProfile';
import Cart from './pages/Cart';
import Products from './pages/Products';
import AllShops from './pages/AllShops';

const ComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <span className="text-6xl mb-4">🚧</span>
    <h2 className="text-4xl font-black text-slate-900 mb-3">Coming Soon</h2>
    <p className="text-slate-500">This page is under construction. Check back later!</p>
  </div>
);

// Auth pages use screen layout
const AuthLayout = ({ children }) => <>{children}</>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes*/}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Main app route hai */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register-shop" element={<ShopOnboard />} />
                <Route path="/shop/:id" element={<ShopProfile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/products" element={<Products />} />
                <Route path="/shops" element={<AllShops />} />
                <Route path="*" element={<ComingSoon />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
