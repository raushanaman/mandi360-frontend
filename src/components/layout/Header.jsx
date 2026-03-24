import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineShoppingBag,
  HiOutlineUserCircle,
  HiOutlineSearch,
  HiOutlineChevronDown,
  HiOutlineMenu,
  HiOutlineX,
} from 'react-icons/hi';
import { CATEGORIES } from '../../data/shopsData';

const Header = () => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLink = (to) =>
    `px-4 py-2 text-sm font-semibold transition-all relative ${
      pathname === to || (to !== '/' && pathname.startsWith(to))
        ? 'text-slate-900 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-slate-900 after:rounded-full'
        : 'text-slate-500 hover:text-slate-900'
    }`;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/shops?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6" style={{ height: '72px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900 flex-shrink-0">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ears */}
            <circle cx="8" cy="8" r="6" fill="#1e293b"/>
            <circle cx="28" cy="8" r="6" fill="#1e293b"/>
            <circle cx="8" cy="8" r="3" fill="#475569"/>
            <circle cx="28" cy="8" r="3" fill="#475569"/>
            {/* Face */}
            <circle cx="18" cy="20" r="14" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            {/* Eye patches */}
            <ellipse cx="12" cy="17" rx="4" ry="4.5" fill="#1e293b"/>
            <ellipse cx="24" cy="17" rx="4" ry="4.5" fill="#1e293b"/>
            {/* Eyes */}
            <circle cx="12" cy="17" r="2" fill="white"/>
            <circle cx="24" cy="17" r="2" fill="white"/>
            <circle cx="12.5" cy="17" r="1" fill="#1e293b"/>
            <circle cx="24.5" cy="17" r="1" fill="#1e293b"/>
            {/* Nose */}
            <ellipse cx="18" cy="23" rx="2.5" ry="1.5" fill="#1e293b"/>
            {/* Mouth */}
            <path d="M15 25.5 Q18 28 21 25.5" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="hidden sm:block">PANDA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/" className={navLink('/')}>Home</Link>

          {/* Products Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setProductsOpen(o => !o)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-all relative ${
                pathname.startsWith('/products')
                  ? 'text-slate-900 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-slate-900 after:rounded-full'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Products
              <HiOutlineChevronDown
                size={15}
                className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {productsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[520px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                      Shop by Category
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {CATEGORIES.map(cat => (
                        <Link
                          key={cat.id}
                          to={`/products/${cat.id}`}
                          onClick={() => setProductsOpen(false)}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-all group text-center"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {cat.emoji}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                            {cat.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Browse all registered local shops</span>
                    <Link
                      to="/shops"
                      onClick={() => setProductsOpen(false)}
                      className="text-xs font-black text-red-500 hover:text-red-600 transition-colors"
                    >
                      View All Shops →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/shops" className={navLink('/shops')}>Local Shops</Link>
          <Link to="/register-shop" className={navLink('/register-shop')}>Sell on Panda</Link>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shops, products..."
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link to="/cart">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              <HiOutlineShoppingBag size={24} />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                2
              </span>
            </motion.div>
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-2 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="bg-slate-100 p-1.5 rounded-lg text-slate-500">
              <HiOutlineUserCircle size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Login</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 transition"
          >
            {mobileOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search shops, products..."
                  className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-3 rounded-xl text-sm outline-none"
                />
              </form>

              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Home</Link>

              {/* Mobile Products Accordion */}
              <div>
                <button
                  onClick={() => setMobileProductsOpen(o => !o)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Products
                  <HiOutlineChevronDown size={15} className={`transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {mobileProductsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-3"
                    >
                      <div className="grid grid-cols-2 gap-1 py-2">
                        {CATEGORIES.map(cat => (
                          <Link
                            key={cat.id}
                            to={`/products/${cat.id}`}
                            onClick={() => { setMobileOpen(false); setMobileProductsOpen(false); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-medium"
                          >
                            <span>{cat.emoji}</span> {cat.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/shops" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Local Shops</Link>
              <Link to="/register-shop" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Sell on Panda</Link>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 text-center mt-2">Create Account</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
