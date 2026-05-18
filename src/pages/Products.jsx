import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { CATEGORIES } from '../data/shopsData';
import { ShopCard, Pagination } from '../components/common/ShopCard';
import API from '../utils/api';
import axios from 'axios';

const PER_PAGE = 8;

const CATEGORY_BG = {
  groceries:   'from-green-900  to-green-700',
  electronics: 'from-blue-900   to-blue-700',
  sports:      'from-orange-900 to-orange-700',
  clothing:    'from-purple-900 to-purple-700',
  cosmetics:   'from-pink-900   to-pink-700',
  furniture:   'from-yellow-900 to-yellow-700',
  bakery:      'from-amber-900  to-amber-700',
};

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const activeCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const [page,      setPage]      = useState(1);
  const [sortBy,    setSortBy]    = useState('rating');
  const [shops,     setShops]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [priceMin,  setPriceMin]  = useState('');
  const [priceMax,  setPriceMax]  = useState('');  // price filter (shop min price)

  useEffect(() => {
    setLoading(true);
    const cat = category || CATEGORIES[0].id;
    axios.get(`${API}/shops?category=${cat}`)
      .then(r => setShops(r.data))
      .catch(() => setShops([]))
      .finally(() => setLoading(false));
    setPage(1);
  }, [category]);

  const filtered = useMemo(() => {
    let result = [...shops];
    if (search) result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    if (priceMin) result = result.filter(s => (s.minPrice || 0) >= Number(priceMin));
    if (priceMax) result = result.filter(s => (s.minPrice || 0) <= Number(priceMax));
    if (sortBy === 'rating')  result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'reviews') result.sort((a, b) => b.reviews - a.reviews);
    if (sortBy === 'newest')  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [shops, sortBy, search, priceMin, priceMax]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCategoryChange = (id) => { navigate(`/products/${id}`); setPage(1); };
  const bgGradient = CATEGORY_BG[category] || CATEGORY_BG.groceries;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Category Hero Banner */}
      <div className={`relative bg-gradient-to-br ${bgGradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14">
          <motion.div key={category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Browse by Category</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-6xl">{activeCategory.emoji}</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight">{activeCategory.label}</h1>
            </div>
            <p className="text-white/60 text-lg">
              {loading ? '...' : filtered.length} shops available
            </p>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 40" fill="none" className="w-full -mb-1">
          <path d="M0 20 Q360 40 720 20 Q1080 0 1440 20 L1440 40 L0 40 Z" fill="#f8fafc"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-24"
          >
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <HiOutlineAdjustments size={12} /> Categories
              </p>
            </div>
            <nav className="p-2 space-y-0.5">
              {CATEGORIES.map(cat => {
                const isActive = cat.id === (category || CATEGORIES[0].id);
                return (
                  <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="flex-1 text-left">{cat.label}</span>
                  </button>
                );
              })}
            </nav>
          </motion.div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Category Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 lg:hidden">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  cat.id === (category || CATEGORIES[0].id)
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-2xl border border-slate-100 px-5 py-3 shadow-sm">
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search shops..."
              className="flex-1 min-w-[160px] border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-slate-400"
            />
            <input type="number" value={priceMin} onChange={e => { setPriceMin(e.target.value); setPage(1); }}
              placeholder="Min ₹"
              className="w-24 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <input type="number" value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }}
              placeholder="Max ₹"
              className="w-24 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-4 py-2 rounded-xl outline-none cursor-pointer"
            >
              <option value="rating">⭐ Top Rated</option>
              <option value="reviews">💬 Most Reviewed</option>
              <option value="newest">🆕 Newest</option>
            </select>
            <p className="text-sm text-slate-500 font-medium ml-auto">
              <span className="font-bold text-slate-900">{filtered.length}</span> shops
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-28">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {paginated.length > 0 ? (
                <motion.div key={`${category}-${page}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginated.map(shop => <ShopCard key={shop._id} shop={shop} />)}
                  </div>
                  {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">🏪</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No shops found</h3>
                  <p className="text-slate-500">No registered shops in this category yet.</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
